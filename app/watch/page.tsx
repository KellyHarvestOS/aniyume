'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Lobby } from './Lobby';

export default function WatchPartyLobbyPage() {
    const router = useRouter();

    const handleCreate = () => router.push('/catalog');

    // При нажатии на кнопку "Назад"
    const handleBack = () => router.back();

    return (
        <Lobby
            onCreate={handleCreate}
            onBack={handleBack}
        />
    );
}
