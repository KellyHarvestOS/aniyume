'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessage, { Message } from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import ChatSidebar, { ChatPreview } from '@/components/chat/ChatSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { getStorageAssetUrl } from '@/lib/storage';

interface ApiMessage {
    id: number;
    sender_id: number;
    body: string | null;
    photo_path: string | null;
    created_at: string;
}

interface ApiUser {
    id: number;
    name: string;
    avatar: string | null;
    is_online: boolean;
    is_blocked?: boolean;
}

const isGif = (value: string | null) => Boolean(value && /^https?:\/\/.+\.gif(\?.*)?$/i.test(value));

export default function ChatPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { user: me, isLoading } = useAuth();
    const friendId = Number(params.id);
    const [friend, setFriend] = useState<ApiUser | null>(null);
    const [chats, setChats] = useState<ChatPreview[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isLoading && !me) router.push('/login');
    }, [isLoading, me, router]);

    const authHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        Accept: 'application/json',
    });

    const mapMessage = (message: ApiMessage): Message => ({
        id: String(message.id),
        text: isGif(message.body) ? undefined : message.body || undefined,
        gifUrl: isGif(message.body) ? message.body! : undefined,
        imageUrl: getStorageAssetUrl(message.photo_path) || undefined,
        senderId: message.sender_id,
        timestamp: new Date(message.created_at),
    });

    const loadChat = useCallback(async () => {
        if (!friendId) return;
        const [chatResponse, listResponse] = await Promise.all([
            fetch(`/api/external/chats/${friendId}`, { headers: authHeaders() }),
            fetch('/api/external/chats', { headers: authHeaders() }),
        ]);
        if (chatResponse.ok) {
            const data = await chatResponse.json();
            setFriend(data.user);
            setMessages((data.messages || []).map(mapMessage));
        } else if (chatResponse.status === 403) {
            setError('Чат доступен только между друзьями');
        }
        if (listResponse.ok) {
            const data = await listResponse.json();
            setChats((data.data || []).map((chat: any) => ({
                id: chat.user.id,
                name: chat.user.name,
                avatar: chat.user.avatar,
                is_online: chat.user.is_online,
                lastMessage: chat.last_message?.photo_path ? 'Фотография' : chat.last_message?.body || 'Начните переписку',
            })));
        }
    }, [friendId]);

    useEffect(() => {
        loadChat();
        const timer = window.setInterval(loadChat, 3000);
        return () => window.clearInterval(timer);
    }, [loadChat]);

    useEffect(() => {
        scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (data: { text?: string; gif?: string; image?: File }) => {
        const form = new FormData();
        if (data.text || data.gif) form.set('body', data.text || data.gif || '');
        if (data.image) form.set('photo', data.image);
        const response = await fetch(`/api/external/chats/${friendId}/messages`, {
            method: 'POST',
            headers: authHeaders(),
            body: form,
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            setError(response.status === 429 ? 'Повторяющиеся сообщения: отправка отключена на 5 секунд' : result.errors?.body?.[0] || result.message || 'Не удалось отправить сообщение');
            return;
        }
        setError('');
        setMessages((current) => [...current, mapMessage(result.data)]);
    };

    const clearChat = async () => {
        const response = await fetch(`/api/external/chats/${friendId}`, { method: 'DELETE', headers: authHeaders() });
        if (response.ok) setMessages([]);
    };

    const toggleBlock = async () => {
        if (!friend) return;
        const response = await fetch(`/api/external/chats/${friendId}/block`, {
            method: friend.is_blocked ? 'DELETE' : 'POST',
            headers: authHeaders(),
        });
        if (response.ok) setFriend({ ...friend, is_blocked: !friend.is_blocked });
    };

    return (
        <div className="h-screen max-h-screen bg-white dark:bg-[#111111] transition-colors overflow-hidden relative flex">
            <ChatSidebar chats={chats} activeChatId={friendId} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="flex-1 flex flex-col min-w-0 relative z-10 h-full">
                <ChatHeader
                    friendId={friendId}
                    friendName={friend?.name || `Пользователь ${friendId}`}
                    friendAvatar={friend?.avatar}
                    isOnline={friend?.is_online || false}
                    isBlocked={friend?.is_blocked || false}
                    onClear={clearChat}
                    onBlock={toggleBlock}
                />
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-8 py-8 flex flex-col gap-2">
                    {error && <p className="mx-auto rounded-xl bg-red-500/10 p-3 text-sm font-bold text-red-500">{error}</p>}
                    {messages.map((message) => <ChatMessage key={message.id} msg={message} isMe={message.senderId === me?.id} />)}
                    {!messages.length && !error && <p className="pt-20 text-center text-sm text-gray-400">Здесь пока нет сообщений</p>}
                </div>
                <ChatInput onSend={handleSendMessage} disabled={friend?.is_blocked} />
            </div>
        </div>
    );
}
