"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaArrowLeft,
  FaShieldAlt,
  FaCreditCard,
  FaQrcode,
  FaWallet,
  FaMobileAlt,
  FaUniversity,
  FaBitcoin
} from "react-icons/fa";
import { RiVipCrownFill } from "react-icons/ri";

const paymentMethods = [
  { id: "card", label: "Банковская карта", description: "Visa, Mastercard, Мир", icon: FaCreditCard },
  { id: "sbp", label: "СБП", description: "Быстрая оплата по QR", icon: FaQrcode },
  { id: "tinkoff", label: "T-Pay", description: "В приложении Т-Банка", icon: FaMobileAlt },
  { id: "sber", label: "SberPay", description: "Через СберБанк Онлайн", icon: FaUniversity },
  { id: "yoomoney", label: "ЮMoney", description: "Оплата через кошелек", icon: FaWallet },
  { id: "crypto", label: "Криптовалюта", description: "USDT, TON, BTC", icon: FaBitcoin },
];

const qrMethods = new Set(["sbp", "tinkoff", "sber", "crypto"]);

function FakeQrCode() {
  return (
    <div className="mx-auto grid h-40 w-40 grid-cols-7 gap-1.5 rounded-2xl bg-white p-3 shadow-sm dark:bg-zinc-900">
      {Array.from({ length: 49 }).map((_, index) => {
        const isCorner = [0, 1, 7, 8, 5, 6, 12, 13, 35, 36, 42, 43].includes(index) || index % 5 === 0 || index % 11 === 0;
        return (
          <span
            key={index}
            className={`rounded-sm transition-all duration-500 ${isCorner ? "bg-teal-500" : index % 3 === 0 ? "bg-zinc-800 dark:bg-zinc-200" : "bg-transparent"
              }`}
          />
        );
      })}
    </div>
  );
}

export default function PremiumCheckoutPage() {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    window.setTimeout(() => setIsProcessing(false), 1500);
  };

  const showCardFields = selectedMethod === "card";
  const showQr = qrMethods.has(selectedMethod);
  const selectedPayment = paymentMethods.find((method) => method.id === selectedMethod);

  return (
    <main className="relative min-h-dvh bg-zinc-50 font-sans text-zinc-900 selection:bg-teal-500/30 transition-colors dark:bg-zinc-950 dark:text-zinc-50 sm:px-6 lg:px-8">


      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-[120px] dark:bg-teal-500/15" />

      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-6xl flex-col py-6 lg:py-10">

        <header className="mb-8 flex items-center justify-between px-4 sm:px-0">
          <Link
            href="/premium"
            className="group flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200/50 transition-transform group-hover:-translate-x-1 dark:bg-zinc-800/50">
              <FaArrowLeft className="text-xs" />
            </span>
            Вернуться назад
          </Link>
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <FaShieldAlt className="text-teal-500" />
            Безопасная оплата
          </div>
        </header>

        <section className="grid flex-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(480px,540px)] lg:gap-12">

          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] bg-zinc-900 p-8 text-white shadow-2xl shadow-teal-900/20 dark:bg-zinc-900/50 dark:ring-1 dark:ring-white/10 sm:p-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/30 blur-[80px]" />

            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm font-semibold text-teal-300 backdrop-blur-md">
                <RiVipCrownFill className="text-lg" />
                AniYume Premium
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Откройте все <br />
                  <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">
                    возможности
                  </span>
                </h1>
                <p className="max-w-md text-lg leading-relaxed text-zinc-400">
                  Оформите подписку и наслаждайтесь просмотром без ограничений, рекламы и в максимальном качестве.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-12 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-5 backdrop-blur-sm ring-1 ring-white/10">
                <p className="text-xs font-medium text-zinc-400">Выбранный план</p>
                <p className="mt-1.5 text-xl font-semibold">1 Месяц</p>
              </div>
              <div className="rounded-2xl bg-teal-500/10 p-5 backdrop-blur-sm ring-1 ring-teal-500/30">
                <p className="text-xs font-medium text-teal-300/80">Итого к оплате</p>
                <p className="mt-1.5 text-2xl font-bold text-teal-300">199 ₽</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2.5rem] bg-white p-6 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200 dark:bg-zinc-900/80 dark:shadow-none dark:ring-zinc-800 sm:p-10"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Оплата подписки</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Выберите удобный способ оплаты
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {paymentMethods.map((method) => {
                const isSelected = selectedMethod === method.id;
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`group relative flex flex-col items-start gap-3 rounded-2xl border p-4 transition-all duration-200 hover:shadow-sm ${isSelected
                        ? "border-teal-500 bg-teal-50/50 ring-1 ring-teal-500 dark:bg-teal-500/10"
                        : "border-zinc-200 bg-transparent hover:border-teal-500/30 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                      }`}
                  >
                    <Icon className={`text-2xl transition-colors ${isSelected ? "text-teal-600 dark:text-teal-400" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"}`} />
                    <div className="text-left">
                      <span className={`block text-sm font-semibold ${isSelected ? "text-teal-900 dark:text-teal-100" : "text-zinc-700 dark:text-zinc-300"}`}>
                        {method.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="my-8 h-[1px] w-full bg-zinc-100 dark:bg-zinc-800" />

            <div className="min-h-[180px]">
              {showCardFields && (
                <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4 duration-500">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Номер карты
                    </label>
                    <input
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base font-medium text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:bg-zinc-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Срок действия
                      </label>
                      <input
                        inputMode="numeric"
                        placeholder="ММ / ГГ"
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base font-medium text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:bg-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={3}
                        placeholder="•••"
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base font-medium text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:bg-zinc-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {showQr && (
                <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col items-center justify-center rounded-2xl bg-zinc-50 py-8 text-center ring-1 ring-inset ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800">
                  <FakeQrCode />
                  <p className="mt-6 text-sm font-semibold text-zinc-900 dark:text-white">
                    Оплата через {selectedPayment?.label}
                  </p>
                  <p className="mt-1 max-w-[250px] text-xs text-zinc-500 dark:text-zinc-400">
                    Наведите камеру смартфона или отсканируйте код в приложении банка.
                  </p>
                </div>
              )}

              {selectedMethod === "yoomoney" && (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Номер кошелька или телефон
                  </label>
                  <input
                    placeholder="4100 0000 0000 0000"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base font-medium text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:bg-zinc-900"
                  />
                  <p className="mt-3 text-xs text-zinc-500">Вы будете перенаправлены на сайт ЮMoney для подтверждения.</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="mt-8 relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-teal-500 px-4 py-4 text-sm font-bold text-white transition-all hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Обработка...</span>
                </div>
              ) : (
                <span>Оплатить 199 ₽</span>
              )}
            </button>
            <p className="mt-4 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
              Нажимая кнопку, вы соглашаетесь с условиями подписки и офертой.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}