"use client";

import { FormEvent, useState } from "react";
import { BiFlag, BiSend, BiX } from "react-icons/bi";
import { submitReport } from "@/lib/api";

const categories = [
  { value: "spam", label: "Спам" },
  { value: "abuse", label: "Оскорбления" },
  { value: "toxicity", label: "Токсичность" },
  { value: "bug", label: "Ошибка" },
  { value: "content", label: "Проблема с контентом" },
  { value: "copyright", label: "Авторские права" },
  { value: "other", label: "Другое" },
] as const;

export default function ReportButton({ targetType, targetId, compact = false }: { targetType: "anime" | "comment" | "user"; targetId: number; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: "content", reason: "", details: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [notice, setNotice] = useState("");

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setNotice("");
    try {
      const result = await submitReport({ target_type: targetType, target_id: targetId, category: form.category as any, reason: form.reason, details: form.details });
      setStatus("success");
      setNotice(result.message ?? "Жалоба отправлена");
      setForm({ category: "content", reason: "", details: "" });
    } catch (error) {
      setStatus("error");
      setNotice(error instanceof Error ? error.message : "Не удалось отправить жалобу");
    }
  }

  return <>
    <button onClick={() => setOpen(true)} className={`inline-flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/10 font-black uppercase tracking-widest text-rose-500 transition hover:bg-rose-500/20 ${compact ? "px-2 py-1 text-[10px]" : "px-4 py-3 text-xs"}`} type="button"><BiFlag /> Пожаловаться</button>
    {open ? <div className="fixed inset-0 z-[999] grid place-items-center bg-black/70 p-4 backdrop-blur" onMouseDown={(e) => { if (e.currentTarget === e.target) setOpen(false); }}>
      <form onSubmit={send} className="w-full max-w-xl rounded-[2rem] border border-brand/30 bg-white p-6 shadow-2xl dark:bg-[#151515]">
        <div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.25em] text-brand">trust & safety</p><h3 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">Жалоба</h3><p className="text-sm text-gray-500 dark:text-gray-400">Сообщи модераторам о проблеме. Мы проверим обращение в админке.</p></div><button className="rounded-xl bg-gray-100 p-3 dark:bg-[#222]" onClick={() => setOpen(false)} type="button"><BiX /></button></div>
        <label className="grid gap-2"><span className="text-xs font-black uppercase text-gray-500">Категория</span><select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand dark:border-white/10 dark:bg-[#111]" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label className="mt-4 grid gap-2"><span className="text-xs font-black uppercase text-gray-500">Причина</span><input required maxLength={255} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand dark:border-white/10 dark:bg-[#111]" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Коротко: что не так?" /></label>
        <label className="mt-4 grid gap-2"><span className="text-xs font-black uppercase text-gray-500">Детали</span><textarea maxLength={3000} rows={5} className="resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand dark:border-white/10 dark:bg-[#111]" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder="Опиши подробнее, если нужно" /></label>
        {notice ? <div className={`mt-4 rounded-2xl border p-4 font-bold ${status === "success" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-500" : "border-rose-400/30 bg-rose-400/10 text-rose-500"}`}>{notice}</div> : null}
        <button disabled={status === "loading"} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-4 font-black uppercase italic tracking-widest text-white transition hover:brightness-110 disabled:opacity-60" type="submit"><BiSend /> {status === "loading" ? "Отправляем…" : "Отправить жалобу"}</button>
      </form>
    </div> : null}
  </>;
}
