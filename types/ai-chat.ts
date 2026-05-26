export type AiChatDirection = 'outgoing' | 'incoming';

export type AiChatHistoryDirection = 'inbound' | 'outbound' | AiChatDirection | string;

export type AiChatHistoryRole = 'user' | 'assistant' | 'system' | string;

export interface AiChatTranscriptItem {
  direction: AiChatDirection;
  content: string;
}

export interface AiChatHistoryMessage {
  role: AiChatHistoryRole;
  direction: AiChatHistoryDirection;
  content: string;
  created_at?: string | null;
}

export interface AiChatSessionSummary {
  session_id: string;
  created_at?: string | null;
  updated_at?: string | null;
  last_message_at?: string | null;
  messages_count?: number;
}

export interface AiChatSessionsApiResponse {
  status: 'success';
  data: {
    sessions: AiChatSessionSummary[];
  };
}

export interface AiChatSessionApiResponse {
  status: 'success';
  data: {
    session_id: string;
    created_at?: string | null;
    updated_at?: string | null;
    last_message_at?: string | null;
    messages: AiChatHistoryMessage[];
  };
}

export interface AiChatPageContext {
  route?: string;
  anime_id?: number;
  episode_id?: number;
  title?: string;
  locale?: string;
  [key: string]: unknown;
}

export interface AiChatRequest {
  message: string;
  session_id?: string;
  page_context?: AiChatPageContext;
}

export interface AiChatResponseData {
  message: string;
  session_id: string;
  provider: string;
  moderated: boolean;
  metadata: Record<string, unknown>;
  limits?: string[];
}

export interface AiChatApiResponse {
  status: 'success';
  data: AiChatResponseData;
}

export interface AiChatErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  limits?: string[];
}

export interface AiChatResult {
  content: string;
  sessionId: string;
  provider: string;
  moderated: boolean;
  metadata: Record<string, unknown>;
  limits: string[];
}
