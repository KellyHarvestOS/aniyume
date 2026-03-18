'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TbArrowBack } from "react-icons/tb";

interface AuthBackgroundProps {
  children: React.ReactNode;
}

export default function AuthBackground({ children }: AuthBackgroundProps) {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <style jsx global>{`
        .jp-matrix {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-color: #f0fdfa;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
          grid-auto-rows: 40px;
          font-size: 32px;
          color: #0f766e;
          font-family: "Courier New", Courier, monospace;
          justify-content: center;
          align-content: center;
        }
         .dark .jp-matrix {
         background-color: #111111;
       }

          .dark .jp-matrix > span {
          color: rgba(148, 163, 184, 0.6);
        }

        .jp-matrix > span {
          text-align: center;
          text-shadow: 0 0 5px rgba(45, 212, 191, 0.6);
          user-select: none;
          transition: color 0.5s, text-shadow 0.5s;
          line-height: 1;
        }

        .jp-matrix > span:nth-child(19n + 2) {
          animation: smooth-pulse 3.5s ease-in-out infinite 0.2s;
        }
        .jp-matrix > span:nth-child(29n + 1) {
          animation: smooth-pulse 4.1s ease-in-out infinite 0.7s;
        }
        .jp-matrix > span:nth-child(11n) {
          color: rgba(45, 212, 191, 0.9);
          animation: smooth-pulse 2.9s ease-in-out infinite 1.1s;
        }
        .jp-matrix > span:nth-child(37n + 10) {
          animation: smooth-pulse 5.3s ease-in-out infinite 1.5s;
        }
        .jp-matrix > span:nth-child(41n + 1) {
          animation: smooth-pulse 3.9s ease-in-out infinite 0.4s;
        }
        .jp-matrix > span:nth-child(17n + 9) {
          animation: smooth-pulse 2.8s ease-in-out infinite 0.9s;
        }
        .jp-matrix > span:nth-child(23n + 18) {
          animation: smooth-pulse 4.3s ease-in-out infinite 1.3s;
        }
        .jp-matrix > span:nth-child(31n + 4) {
          animation: smooth-pulse 5.6s ease-in-out infinite 0.1s;
        }
        .jp-matrix > span:nth-child(43n + 20) {
          animation: smooth-pulse 3.6s ease-in-out infinite 1.8s;
        }
        .jp-matrix > span:nth-child(13n + 6) {
          animation: smooth-pulse 3.2s ease-in-out infinite 1.2s;
        }
        .jp-matrix > span:nth-child(53n + 5) {
          animation: smooth-pulse 4.9s ease-in-out infinite 0.5s;
        }
        .jp-matrix > span:nth-child(47n + 15) {
          animation: smooth-pulse 5.9s ease-in-out infinite 1s;
        }

        @keyframes smooth-pulse {
          0%,
          100% {
            color: rgba(15, 118, 110, 0.4);
            text-shadow: 0 0 5px rgba(15, 118, 110, 0.6);
          }
          30% {
            color: rgba(45, 212, 191, 1);
            text-shadow: 0 0 10px rgba(45, 212, 191, 1),
              0 0 15px rgba(45, 212, 191, 1);
          }
          50% {
            color: rgba(20, 184, 166, 1);
            text-shadow: 0 0 10px rgba(20, 184, 166, 1),
              0 0 15px rgba(20, 184, 166, 1);
          }
          70% {
            color: rgba(153, 246, 228, 1);
            text-shadow: 0 0 10px rgba(153, 246, 228, 1),
              0 0 20px rgba(153, 246, 228, 1),
              0 0 30px rgba(153, 246, 228, 1);
          }
        }
      `}</style>

      <div className="jp-matrix">
        <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span> <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span> <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span> <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span> <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span>
        <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span> <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span> <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span> <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span> <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span>
        <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span>
      </div>

      <div className="pointer-events-none fixed inset-0 bg-white/65 z-1 dark:bg-[#111111]/40" />


      <button
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-3 flex items-center gap-2 rounded-lg border-2 border-[#2EC4B6]/60 bg-white px-4 py-2 text-sm font-semibold text-[#2EC4B6] hover:bg-gray-100 hover:border-[#2EC4B6] transition dark:bg-[#111111] dark:hover:bg-[#111111]/90"
      >
        <TbArrowBack className="text-2xl" />
        <span>Назад</span>
      </button>

      <div className="relative z-2 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
