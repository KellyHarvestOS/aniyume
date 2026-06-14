"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiFlag, BiSend, BiX, BiChevronDown, BiCheck, BiLoaderAlt, BiErrorCircle, BiCheckCircle } from "react-icons/bi";
import { submitReport } from "@/lib/api";
import { useI18n } from "@/contexts/I18nContext";

const categories = [
  { value: "spam", labelKey: "report.spam" },
  { value: "abuse", labelKey: "report.abuse" },
  { value: "toxicity", labelKey: "report.toxicity" },
  { value: "bug", labelKey: "report.bug" },
  { value: "content", labelKey: "report.content" },
  { value: "copyright", labelKey: "report.copyright" },
  { value: "other", labelKey: "report.other" },
] as const;

export default function ReportButton({ targetType, targetId, compact = false }: { targetType: "anime" | "comment" | "user"; targetId: number; compact?: boolean }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [form, setForm] = useState({ category: "content", reason: "", details: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [notice, setNotice] = useState("");
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    if (dropOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [dropOpen]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setNotice("");
    try {
      const result = await submitReport({ target_type: targetType, target_id: targetId, category: form.category as any, reason: form.reason, details: form.details });
      setStatus("success");
      setNotice(result.message ?? t("report.sent"));
      setTimeout(() => { setOpen(false); setStatus("idle"); setNotice(""); }, 2000);
    } catch (error) {
      setStatus("error");
      setNotice(error instanceof Error ? error.message : t("report.sendFailed"));
    }
  }

  const activeCategory = categories.find(c => c.value === form.category);

  return (
    <>
      <button 
        onClick={() => setOpen(true)} 
        className={`inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 font-black uppercase tracking-widest text-rose-500 transition hover:bg-rose-500/20 ${compact ? "px-2 py-1 text-[10px]" : "px-4 py-3 text-xs"}`} 
        type="button"
      >
        <BiFlag />
        {!compact && <span>{t("report.title")}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-white/60 dark:bg-[#0a0a0a]/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden"
            >
              <form onSubmit={send} className="p-8 md:p-10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-4xl font-extrabold uppercase italic tracking-tighter text-black dark:text-gray-200 leading-none">
                      {t("report.title")}
                    </h3>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                      {t("report.subtitle")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-50/80 dark:bg-[#1a1a1a]/80 text-gray-500 hover:text-brand transition-colors border border-gray-200 dark:border-gray-800 backdrop-blur-md"
                  >
                    <BiX className="text-3xl" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="relative" ref={dropRef}>
                    <span className="block text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2 ml-1">
                      {t("report.category")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDropOpen(!dropOpen)}
                      className="flex items-center justify-between w-full px-5 py-4 bg-gray-50/80 dark:bg-[#1a1a1a]/80 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-bold text-black dark:text-gray-200 focus:border-brand transition-all outline-none backdrop-blur-md"
                    >
                      {activeCategory ? t(activeCategory.labelKey) : ''}
                      <BiChevronDown className={`text-xl transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {dropOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl overflow-hidden backdrop-blur-md"
                        >
                          {categories.map((c) => (
                            <button
                              key={c.value}
                              type="button"
                              onClick={() => { setForm({ ...form, category: c.value }); setDropOpen(false); }}
                              className="flex items-center justify-between w-full px-5 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors border-b last:border-0 border-gray-100 dark:border-gray-800"
                            >
                              {t(c.labelKey)}
                              {form.category === c.value && <BiCheck className="text-brand text-xl" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2 px-1">
                      <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">{t("report.reason")}</span>
                      <span className="text-[10px] text-gray-400 font-bold tracking-widest">{form.reason.length}/255</span>
                    </div>
                    <input
                      required
                      maxLength={255}
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      placeholder={t("report.reasonPlaceholder")}
                      className="w-full px-5 py-4 bg-gray-50/80 dark:bg-[#1a1a1a]/80 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-bold text-black dark:text-gray-200 outline-none focus:border-brand transition-all backdrop-blur-md placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2 px-1">
                      <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">{t("report.details")}</span>
                      <span className="text-[10px] text-gray-400 font-bold tracking-widest">{form.details.length}/3000</span>
                    </div>
                    <textarea
                      maxLength={3000}
                      rows={4}
                      value={form.details}
                      onChange={(e) => setForm({ ...form, details: e.target.value })}
                      placeholder={t("report.detailsPlaceholder")}
                      className="w-full px-5 py-4 bg-gray-50/80 dark:bg-[#1a1a1a]/80 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-bold text-black dark:text-gray-200 outline-none focus:border-brand transition-all backdrop-blur-md resize-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {notice && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-6 p-4 rounded-lg border-2 flex items-center gap-3 text-xs font-bold uppercase tracking-wider ${
                        status === "success" 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                          : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                      }`}
                    >
                      {status === "success" ? <BiCheckCircle className="text-lg" /> : <BiErrorCircle className="text-lg" />}
                      {notice}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  disabled={status === "loading"}
                  className="mt-8 group relative w-full overflow-hidden bg-brand text-white dark:text-[#111] text-sm font-extrabold py-4 rounded-lg flex items-center justify-center gap-3 transition transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-brand/20 disabled:opacity-50 uppercase tracking-widest"
                  type="submit"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  {status === "loading" ? (
                    <BiLoaderAlt className="text-xl animate-spin" />
                  ) : (
                    <>
                      <BiSend className="text-lg" />
                      <span>{t("comments.send")}</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
}