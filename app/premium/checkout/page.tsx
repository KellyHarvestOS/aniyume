"use client";

import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { RiVipCrownFill } from "react-icons/ri";

const paymentMethods = [
  { id: "card", label: "Карта", description: "Visa, Mastercard, Мир" },
  { id: "sbp", label: "СБП", description: "Быстрая оплата по QR" },
  { id: "yoomoney", label: "ЮMoney", description: "Оплата через кошелек" },
  { id: "tinkoff", label: "T-Pay", description: "Быстрая оплата в приложении" },
  { id: "sber", label: "SberPay", description: "Оплата через СберБанк" },
  { id: "crypto", label: "Crypto", description: "USDT, TON, BTC" },
];

const qrMethods = new Set(["sbp", "tinkoff", "sber", "crypto"]);

function FakeQrCode() {
  return (
    <div className="mx-auto grid h-44 w-44 grid-cols-7 gap-1 rounded-3xl bg-white p-4 shadow-inner dark:bg-neutral-950">
      {Array.from({ length: 49 }).map((_, index) => {
        const isCorner =
          [0, 1, 7, 8, 5, 6, 12, 13, 35, 36, 42, 43].includes(index) ||
          index % 5 === 0 ||
          index % 11 === 0;

        return (
          <span
            key={index}
            className={`rounded-[4px] ${isCorner ? "bg-[#168a7f]" : index % 3 === 0 ? "bg-neutral-900 dark:bg-white" : "bg-transparent"}`}
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
    window.setTimeout(() => setIsProcessing(false), 900);
  };

  const showCardFields = selectedMethod === "card";
  const showQr = qrMethods.has(selectedMethod);
  const selectedPayment = paymentMethods.find((method) => method.id === selectedMethod);

  return (
    <main className="min-h-dvh bg-white px-4 py-6 text-neutral-950 transition-colors dark:bg-black dark:text-white sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-7xl flex-col">
        <header className="mb-6 flex items-center justify-between gap-4">
          <Link href="/premium" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white">
            <FaArrowLeft /> Назад
          </Link>
          <span className="rounded-full bg-[#eafffb] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#168a7f] dark:bg-[#168a7f]/15">
            Оплата
          </span>
        </header>

        <section className="grid flex-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(560px,680px)] xl:gap-14">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-neutral-50 p-7 shadow-2xl shadow-neutral-200/70 dark:bg-neutral-950 dark:shadow-black sm:p-10 lg:min-h-[640px]">
            <div className="relative z-10 flex h-full flex-col justify-between gap-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 rounded-full bg-[#eafffb] px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-[#168a7f] dark:bg-[#168a7f]/15">
                  <RiVipCrownFill className="text-xl" /> 
                </div>
                <div className="space-y-4">
                  <h1 className="max-w-3xl text-5xl font-black tracking-tighter sm:text-6xl xl:text-7xl">
                    Покупка <span className="text-[#168a7f]">премиума</span>
                  </h1>
                  <p className="max-w-xl text-lg font-bold leading-8 text-neutral-500 dark:text-neutral-400">
                    Завершите оплату подписки и активируйте Premium на аккаунте.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-black">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Тариф</p>
                  <p className="mt-2 text-2xl font-black">Premium</p>
                </div>
                <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-black">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">К оплате</p>
                  <p className="mt-2 text-2xl font-black text-[#168a7f]">199₽</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-2xl shadow-neutral-200/70 transition-colors dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-black sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-5 dark:border-neutral-800">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#168a7f]">Ваш заказ</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight">Premium на 1 месяц</h1>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black">199₽</div>
              <div className="text-xs font-bold text-neutral-400">итого к оплате</div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-neutral-400">Способ оплаты</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method.id)}
                  className={`rounded-2xl border p-4 text-left transition ${selectedMethod === method.id
                    ? "border-[#168a7f] bg-[#eafffb] text-neutral-950 dark:bg-[#168a7f]/15 dark:text-white"
                    : "border-neutral-200 bg-white hover:border-[#168a7f]/50 dark:border-neutral-800 dark:bg-neutral-900"
                    }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span>
                      <span className="block text-sm font-black uppercase tracking-[0.12em]">{method.label}</span>
                      <span className="mt-1 block text-sm font-semibold text-neutral-500 dark:text-neutral-400">{method.description}</span>
                    </span>
                    <span className={`h-4 w-4 shrink-0 rounded-full border ${selectedMethod === method.id ? "border-[#168a7f] bg-[#168a7f]" : "border-neutral-300 dark:border-neutral-700"}`} />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {showCardFields && (
            <div className="mt-5 grid gap-3">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">Номер карты</span>
                <input inputMode="numeric" placeholder="0000 0000 0000 0000" className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-base font-bold outline-none transition focus:border-[#168a7f] focus:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:focus:bg-black" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">Срок</span>
                  <input inputMode="numeric" placeholder="MM / YY" className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-base font-bold outline-none transition focus:border-[#168a7f] focus:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:focus:bg-black" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">CVV</span>
                  <input inputMode="numeric" placeholder="123" className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-base font-bold outline-none transition focus:border-[#168a7f] focus:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:focus:bg-black" />
                </label>
              </div>
            </div>
          )}

          {showQr && (
            <div className="mt-5 rounded-[2rem] border border-neutral-200 bg-neutral-50 p-5 text-center dark:border-neutral-800 dark:bg-neutral-900">
              <FakeQrCode />
              <p className="mt-4 text-sm font-black uppercase tracking-[0.14em] text-neutral-700 dark:text-neutral-200">
                {selectedPayment?.label}
              </p>
              <p className="mt-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                Отсканируйте QR-код в приложении банка или кошелька.
              </p>
            </div>
          )}

          {selectedMethod === "wallet" && (
            <div className="mt-5 rounded-[2rem] border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">Баланс AniYume</p>
              <p className="mt-2 text-3xl font-black">0₽</p>
              <p className="mt-3 text-sm font-semibold text-neutral-500 dark:text-neutral-400">Недостаточно средств. После подключения backend здесь будет пополнение баланса.</p>
            </div>
          )}

          {selectedMethod === "yoomoney" && (
            <div className="mt-5 rounded-[2rem] border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">Номер кошелька или телефон</span>
                <input placeholder="+7 000 000 00 00" className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-base font-bold outline-none transition focus:border-[#168a7f] dark:border-neutral-800 dark:bg-black" />
              </label>
            </div>
          )}

          

          <button type="submit" disabled={isProcessing} className="mt-5 w-full rounded-2xl bg-[#168a7f] px-5 py-5 text-sm font-black uppercase tracking-[0.16em] text-white shadow-xl shadow-[#168a7f]/20 transition hover:bg-[#106f66] disabled:cursor-not-allowed disabled:opacity-70">
            {isProcessing ? "Проверяем оплату..." : "Оплатить 199₽"}
          </button>
          </form>
        </section>
      </div>
    </main>
  );
}
