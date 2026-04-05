import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                content: "Ошибка: API ключ Groq не найден в переменных окружения."
            }, { status: 500 });
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'Ты — официальный AI-помощник аниме-портала AniYume. Ты эксперт в аниме, добрый, вежливый и используешь милые эмодзи. Твоя задача — помогать пользователям сайта. Отвечай на русском языке.'
                    },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 1024,
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error("Groq API Error:", data.error);
            return NextResponse.json({ content: "Извини, произошла ошибка на стороне нейросети." }, { status: 200 });
        }

        return NextResponse.json({ content: data.choices[0].message.content });

    } catch (error: any) {
        console.error("CHAT_ERROR:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}