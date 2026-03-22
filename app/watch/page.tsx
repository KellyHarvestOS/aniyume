'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lobby } from './Lobby';
import { RoomHeader } from './RoomHeader';
import { VideoPlayer } from './VideoPlayer';
import { ChatSidebar } from './ChatSidebar';
import { RoomInfo } from './RoomInfo';

export default function WatchPartyPage() {
    const router = useRouter();
    const [roomId, setRoomId] = useState<string | null>(null);
    const [inputCode, setInputCode] = useState('');
    const [copied, setCopied] = useState(false);

    const generateRoomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const seg = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        return `${seg(2)}-${seg(4)}`;
    };

    const handleCreate = () => setRoomId(generateRoomCode());
    const handleExit = () => setRoomId(null);
    const handleBack = () => router.back();

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputCode.trim().length > 3) setRoomId(inputCode.toUpperCase());
    };

    const handleCopy = () => {
        if (roomId) {
            navigator.clipboard.writeText(roomId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!roomId) {
        return (
            <Lobby
                onCreate={handleCreate}
                onJoin={handleJoin}
                onBack={handleBack}
                inputCode={inputCode}
                setInputCode={setInputCode}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#080808] text-gray-900 dark:text-gray-200 flex flex-col transition-colors">
            <RoomHeader roomId={roomId} onCopy={handleCopy} copied={copied} onExit={handleExit} />
            <main className="flex-1 p-4 lg:p-8 max-w-[1600px] mx-auto w-full">
                <div className="grid w-full grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
                    <div className="min-w-0 flex flex-col gap-6">
                        <div className="rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video">
                            <VideoPlayer roomId={roomId} />
                        </div>
                        <RoomInfo roomId={roomId} />
                    </div>

                    <aside className="sticky top-24 h-[calc(100vh-120px)]">
                        <ChatSidebar roomId={roomId} />
                    </aside>
                </div>
            </main>
        </div>
    );
}