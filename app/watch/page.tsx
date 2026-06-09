'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Lobby } from './Lobby';

export default function WatchPartyLobbyPage() {
    const router = useRouter();

    const generateRoomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const seg = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        return `${seg(2)}-${seg(4)}`;
    };

    const handleCreate = () => {
        const newRoomCode = generateRoomCode();
        router.push(`/watch-party/${newRoomCode}`);
    };

    // При нажатии на кнопку "Назад"
    const handleBack = () => router.back();

    return (
        <Lobby
            onCreate={handleCreate}
            onBack={handleBack}
        />
    );
}
