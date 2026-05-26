import { api } from './api';
import type {
  AiChatApiResponse,
  AiChatErrorResponse,
  AiChatHistoryMessage,
  AiChatPageContext,
  AiChatRequest,
  AiChatResult,
  AiChatSessionApiResponse,
  AiChatSessionsApiResponse,
  AiChatSessionSummary,
} from '@/types/ai-chat';

const AI_CHAT_ENDPOINT = '/ai/chat';
const AI_CHAT_SESSIONS_ENDPOINT = '/ai/chat/sessions';

export class AiChatGatewayError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly limits: string[] = [],
  ) {
    super(message);
    this.name = 'AiChatGatewayError';
  }
}

function normalizeAiChatResponse(response: AiChatApiResponse): AiChatResult {
  const { data } = response;

  if (response.status === 'success' && typeof data?.message === 'string' && data.message.trim()) {
    return {
      content: data.message,
      sessionId: data.session_id,
      provider: data.provider,
      moderated: data.moderated,
      metadata: data.metadata ?? {},
      limits: Array.isArray(data.limits) ? data.limits : [],
    };
  }

  throw new AiChatGatewayError('AI gateway returned an empty response');
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeSessionSummary(value: unknown): AiChatSessionSummary | null {
  if (!isObject(value) || typeof value.session_id !== 'string' || !value.session_id.trim()) {
    return null;
  }

  return {
    session_id: value.session_id,
    created_at: typeof value.created_at === 'string' || value.created_at === null ? value.created_at : undefined,
    updated_at: typeof value.updated_at === 'string' || value.updated_at === null ? value.updated_at : undefined,
    last_message_at: typeof value.last_message_at === 'string' || value.last_message_at === null ? value.last_message_at : undefined,
    messages_count: typeof value.messages_count === 'number' ? value.messages_count : undefined,
  };
}

function normalizeHistoryMessage(value: unknown): AiChatHistoryMessage | null {
  if (!isObject(value) || typeof value.content !== 'string') {
    return null;
  }

  return {
    role: typeof value.role === 'string' ? value.role : 'assistant',
    direction: typeof value.direction === 'string' ? value.direction : 'outbound',
    content: value.content,
    created_at: typeof value.created_at === 'string' || value.created_at === null ? value.created_at : undefined,
  };
}

async function readAiChatJson<T>(response: Response): Promise<T> {
  try {
    return await response.json();
  } catch {
    throw new AiChatGatewayError('AI gateway returned an invalid response', response.status);
  }
}

export async function sendAiChatMessage(
  message: string,
  options: { sessionId?: string; pageContext?: AiChatPageContext } = {},
): Promise<AiChatResult> {
  const payload: AiChatRequest = {
    message,
    ...(options.sessionId ? { session_id: options.sessionId } : {}),
    ...(options.pageContext ? { page_context: options.pageContext } : {}),
  };

  const response = await api.post(AI_CHAT_ENDPOINT, payload);

  const data = await readAiChatJson<AiChatApiResponse | AiChatErrorResponse>(response);

  if (!response.ok) {
    const errorData = data as AiChatErrorResponse;

    throw new AiChatGatewayError(
      errorData.message || errorData.error || `AI gateway request failed with status ${response.status}`,
      response.status,
      errorData.limits || [],
    );
  }

  return normalizeAiChatResponse(data as AiChatApiResponse);
}

export async function fetchAiChatSessions(): Promise<AiChatSessionSummary[]> {
  const response = await api.get(AI_CHAT_SESSIONS_ENDPOINT);
  const data = await readAiChatJson<AiChatSessionsApiResponse | AiChatErrorResponse>(response);

  if (!response.ok) {
    const errorData = data as AiChatErrorResponse;

    throw new AiChatGatewayError(
      errorData.message || errorData.error || `AI chat sessions request failed with status ${response.status}`,
      response.status,
      errorData.limits || [],
    );
  }

  const sessions = (data as AiChatSessionsApiResponse).data?.sessions;
  return Array.isArray(sessions) ? sessions.map(normalizeSessionSummary).filter((session): session is AiChatSessionSummary => session !== null) : [];
}

export async function fetchAiChatSession(sessionId: string): Promise<{ sessionId: string; messages: AiChatHistoryMessage[] }> {
  const response = await api.get(`${AI_CHAT_SESSIONS_ENDPOINT}/${encodeURIComponent(sessionId)}`);
  const data = await readAiChatJson<AiChatSessionApiResponse | AiChatErrorResponse>(response);

  if (!response.ok) {
    const errorData = data as AiChatErrorResponse;

    throw new AiChatGatewayError(
      errorData.message || errorData.error || `AI chat session request failed with status ${response.status}`,
      response.status,
      errorData.limits || [],
    );
  }

  const sessionData = (data as AiChatSessionApiResponse).data;
  const messages = Array.isArray(sessionData?.messages)
    ? sessionData.messages.map(normalizeHistoryMessage).filter((message): message is AiChatHistoryMessage => message !== null)
    : [];

  return {
    sessionId: typeof sessionData?.session_id === 'string' ? sessionData.session_id : sessionId,
    messages,
  };
}
