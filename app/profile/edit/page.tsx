"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import EditProfileSkeleton from "@/components/skeletons/EditProfileSkeleton";
import { FaDiscord, FaGithub, FaGlobe, FaInstagram, FaPencilAlt, FaPlus, FaQuoteLeft, FaTelegramPlane, FaTimes, FaUser, FaVk, FaYoutube, FaInfoCircle, FaChevronLeft, FaCheckCircle, FaExclamationCircle, FaPalette } from 'react-icons/fa';
import ImageCropModal from "@/components/modals/ImageCropModal";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SiCodemagic } from "react-icons/si";
import { MagnetIcon } from "lucide-react";
import { GiMagicAxe } from "react-icons/gi";
import { BsCursor } from "react-icons/bs";
import { HiCursorClick } from "react-icons/hi";

const MAX_SOCIAL_LINKS = 10;

const getUrlHost = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return "";

  try {
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    return new URL(normalized).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
};

const isHost = (host: string, domains: string[]) => domains.some((domain) => host === domain || host.endsWith(`.${domain}`));

const detectSocial = (url: string) => {
  const host = getUrlHost(url);
  if (isHost(host, ["instagram.com"])) return { label: "Instagram", icon: FaInstagram };
  if (isHost(host, ["t.me", "telegram.me", "telegram.org"])) return { label: "Telegram", icon: FaTelegramPlane };
  if (isHost(host, ["vk.com", "vk.ru"])) return { label: "VK", icon: FaVk };
  if (isHost(host, ["youtube.com", "youtu.be"])) return { label: "YouTube", icon: FaYoutube };
  if (isHost(host, ["discord.gg", "discord.com", "discordapp.com"])) return { label: "Discord", icon: FaDiscord };
  if (isHost(host, ["github.com"])) return { label: "GitHub", icon: FaGithub };
  return { label: "Ссылка", icon: FaGlobe };
};

const validateSocialLink = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return true;

  try {
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(normalized);
    const host = parsed.hostname.toLowerCase();

    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    if (!host.includes('.') || host.startsWith('.') || host.endsWith('.')) return false;

    return true;
  } catch {
    return false;
  }
};

const normalizeSocialLink = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const readSavedSocialLinks = () => {
  try {
    return JSON.parse(localStorage.getItem("profile_social_links") || "[]");
  } catch {
    return [];
  }
};

const normalizeSocialLinks = (value: unknown) => {
  if (!Array.isArray(value)) return [""];
  const links = value.filter((item): item is string => typeof item === "string");
  return links.length > 0 ? links.slice(0, MAX_SOCIAL_LINKS) : [""];
};

export default function EditProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isCustomCursorDisabled, setIsCustomCursorDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    status_text: "",
  });
  const [socialLinks, setSocialLinks] = useState<string[]>([""]);
  const [socialLinkErrors, setSocialLinkErrors] = useState<Record<number, string>>({});

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  useEffect(() => {
    const fetchCurrentData = async () => {
      const premiumStatus = localStorage.getItem("isPremium") === "true";
      setIsPremium(premiumStatus);
      setIsCustomCursorDisabled(localStorage.getItem("premium_cursor_disabled") === "true");

      try {
        const token = localStorage.getItem("userToken");
        if (!token) return router.push("/login");

        const res = await fetch("/api/external/profile/me", {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          const user = data.user || data;
          setFormData({
            name: user.name || "",
            bio: user.bio || "",
            status_text: user.custom_status || user.status_text || "",
          });
          setSocialLinks(normalizeSocialLinks(user.social_links || user.socials || readSavedSocialLinks()));

          const avatar = user.avatar || user.avatar_url;
          if (avatar) {
            const avatarPath = avatar.replace(/^\/+/, "").replace(/^storage\//, "");
            const fullUrl = avatar.startsWith("http") ? avatar : `/api-storage/${avatarPath}`;
            setPreviewUrl(`${fullUrl}?t=${Date.now()}`);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentData();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isGif = file.type === 'image/gif';

      if (isGif && !isPremium) {
        setMessage({ type: "error", text: "GIF-аватарки доступны только для Premium пользователей! 💎" });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if (isGif) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result as string);
        setIsCropOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = (croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
    setSelectedFile(croppedFile);
    setPreviewUrl(URL.createObjectURL(croppedBlob));
    setIsCropOpen(false);
    setTempImage(null);
  };

  const handleCursorDisabledChange = (disabled: boolean) => {
    setIsCustomCursorDisabled(disabled);
    localStorage.setItem("premium_cursor_disabled", String(disabled));
    document.documentElement.classList.toggle("premium-cursor-disabled", disabled);
    window.dispatchEvent(new Event("premiumUpdate"));
  };

  const handleSocialLinkChange = (index: number, value: string) => {
    setSocialLinks((current) => current.map((link, linkIndex) => linkIndex === index ? value : link));
    setSocialLinkErrors((current) => {
      if (validateSocialLink(value)) {
        const next = { ...current };
        delete next[index];
        return next;
      }

      return { ...current, [index]: "Некорректная ссылка" };
    });
  };

  const addSocialLink = () => {
    setSocialLinks((current) => current.length >= MAX_SOCIAL_LINKS ? current : [...current, ""]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks((current) => current.length === 1 ? [""] : current.filter((_, linkIndex) => linkIndex !== index));
    setSocialLinkErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("userToken");
      const nextSocialErrors = socialLinks.reduce<Record<number, string>>((errors, link, index) => {
        if (!validateSocialLink(link)) errors[index] = "Некорректная ссылка";
        return errors;
      }, {});

      if (Object.keys(nextSocialErrors).length > 0) {
        setSocialLinkErrors(nextSocialErrors);
        setMessage({ type: "error", text: "Проверьте ссылки на социальные сети" });
        setSaving(false);
        return;
      }

      const normalizedSocialLinks = socialLinks.map(normalizeSocialLink).filter(Boolean).slice(0, MAX_SOCIAL_LINKS);
      localStorage.setItem("profile_social_links", JSON.stringify(normalizedSocialLinks));
      const profileRes = await fetch("/api/external/profile/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: JSON.stringify({ name: formData.name, custom_status: formData.status_text, bio: formData.bio, social_links: normalizedSocialLinks }),
      });

      if (!profileRes.ok) throw new Error("Ошибка обновления данных профиля");

      if (selectedFile) {
        const avatarData = new FormData();
        avatarData.append("avatar", selectedFile);
        const avatarRes = await fetch("/api/external/profile/me/avatar", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          body: avatarData,
        });
        if (!avatarRes.ok) throw new Error("Ошибка загрузки аватара");
      }

      setMessage({ type: "success", text: "Профиль успешно обновлен!" });
      setTimeout(() => {
        router.refresh();
        router.push("/profile");
      }, 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Не удалось сохранить" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <EditProfileSkeleton />;

  return (
    <div className="flex-1 w-full bg-white dark:bg-[#111111] flex flex-col transition-colors duration-300 overflow-hidden">
      <div className="w-full border-b border-slate-300 dark:border-white/15 bg-slate-50/50 dark:bg-[#111111]/50 backdrop-blur-md px-6 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="group flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-brand transition-all font-bold text-sm">
          <FaChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          ВЕРНУТЬСЯ В ПРОФИЛЬ
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:flex w-72 border-r border-b border-slate-300 dark:border-white/15 p-10 flex-col gap-6 bg-slate-50/30 dark:bg-[#111111]">
          <h1 className="text-4xl font-black text-brand tracking-tighter italic">Настройки</h1>
          <h1 className="text-4xl font-black text-black dark:text-white tracking-tighter italic -mt-5">профиля</h1>
          <p className="text-xs text-slate-500 dark:text-gray-400 font-medium leading-relaxed">
            Настройте свой профиль так, чтобы он выделялся. Ваши данные обновятся мгновенно.
          </p>
        </div>

        <AnimatePresence>
          {isCropOpen && tempImage && <ImageCropModal image={tempImage} onCropComplete={handleCropSave} onClose={() => setIsCropOpen(false)} />}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar border-b border-slate-300 dark:border-white/15">
          <div className="max-w-4xl w-full mx-auto p-6 md:p-12 space-y-12">

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-slate-100 dark:border-white/5">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-brand rounded-full blur opacity-10 group-hover:opacity-30 transition duration-700"></div>
                  <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-brand shadow-xl">
                    {previewUrl ? (
                      <img src={previewUrl} className="w-full h-full object-cover" alt="avatar" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-[#1a1a1a] flex items-center justify-center text-slate-400 dark:text-white text-4xl font-bold">
                        {formData.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <FaPencilAlt className="text-brand w-6 h-6 mb-1" />
                      <span className="text-[10px] font-black text-white uppercase">Изменить</span>
                    </button>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    Фото профиля
                    {isPremium && (
                      <span className="text-[10px] bg-gray-200 text-brand border border-gray-300 px-2 py-0.5 rounded-full uppercase tracking-tighter">Premium</span>
                    )}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400 max-w-sm">
                    Используйте уникальное изображение. <br className="hidden md:block" />
                    Поддерживаются <span className="text-brand font-bold">JPG • PNG {isPremium && "• GIF"}</span>.
                  </p>
                </div>
              </div>

              {isPremium && (
                <Link href="/profile/edit/premiumEdit" className="flex items-center gap-3 px-8 py-4 bg-brand text-white dark:text-black rounded-lg font-black text-[11px] uppercase tracking-[0.15em] hover:scale-105 transition-all shadow-xl shadow-black/10 whitespace-nowrap">
                  <SiCodemagic className="text-white dark:text-black text-lg" />
                  Кастомизация
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-black text-slate-900 dark:text-gray-100 uppercase tracking-[0.15em] ml-1">
                  <FaUser className="text-brand" /> Никнейм
                </label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-white/5 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:bg-white dark:focus:bg-[#1a1a1a] transition-all shadow-sm" placeholder="Ваше имя" required />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-black text-slate-900 dark:text-gray-100 uppercase tracking-[0.15em] ml-1">
                  <FaQuoteLeft className="text-brand" /> Статус
                </label>
                <input type="text" value={formData.status_text} onChange={(e) => setFormData({ ...formData, status_text: e.target.value })} className="w-full px-6 py-4 bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-white/5 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:bg-white dark:focus:bg-[#1a1a1a] transition-all shadow-sm" placeholder="Ваш статус" />
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-black text-slate-900 dark:text-gray-100 uppercase tracking-[0.15em] ml-1">
                  <FaInfoCircle className="text-brand" /> О себе
                </label>
                <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={5} className="w-full px-6 py-4 bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-white/5 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:bg-white dark:focus:bg-[#1a1a1a] transition-all shadow-sm resize-none" placeholder="Расскажите вашу историю..." />
              </div>

              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <label className="flex items-center gap-2 text-[11px] font-black text-slate-900 dark:text-gray-100 uppercase tracking-[0.15em] ml-1">
                    <FaGlobe className="text-brand" /> Социальные сети
                  </label>
                  <button
                    type="button"
                    onClick={addSocialLink}
                    disabled={socialLinks.length >= MAX_SOCIAL_LINKS}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white shadow-lg shadow-[#2EC4B6]/20 transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Добавить ссылку"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>
                <p className="ml-1 text-xs font-semibold text-slate-400">
                  Максимум {MAX_SOCIAL_LINKS} ссылок. Введите настоящий URL, например https://t.me/username
                </p>

                <div className="space-y-3">
                  {socialLinks.map((link, index) => {
                    const social = detectSocial(link);
                    const Icon = social.icon;
                    const hasError = Boolean(socialLinkErrors[index]);

                    return (
                      <div key={index} className={`group flex items-center gap-3 rounded-lg border px-4 py-3 transition-all focus-within:bg-white dark:bg-[#161616] dark:focus-within:bg-[#1a1a1a] ${hasError ? "border-red-400 bg-red-50 dark:border-red-500/60" : "border-slate-200 bg-slate-50 focus-within:border-brand dark:border-white/5"}`}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-sm dark:bg-[#111111]">
                          <Icon className="text-lg" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`mb-1 text-[10px] font-black uppercase tracking-[0.14em] ${hasError ? "text-red-500" : "text-slate-400"}`}>{hasError ? socialLinkErrors[index] : social.label}</p>
                          <input
                            type="url"
                            value={link}
                            onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                            className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                            placeholder="https://..."
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSocialLink(index)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-500/10 hover:text-red-500"
                          aria-label="Удалить ссылку"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>


              {isPremium && (
                <div className="md:col-span-2">

                  <p className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-900 dark:text-gray-100">
                    <HiCursorClick className="text-brand h-4 w-4" />
                    Кастомная мышка
                  </p>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-white/5 dark:bg-[#161616]">
                    <div className="grid gap-3 sm:grid-cols-2">

                      <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${!isCustomCursorDisabled
                        ? "border-brand bg-brand/10"
                        : "border-slate-200 bg-white dark:border-white/5 dark:bg-[#111111]"
                        }`}>
                        <input
                          type="radio"
                          name="customCursor"
                          checked={!isCustomCursorDisabled}
                          onChange={() => handleCursorDisabledChange(false)}
                          className="h-4 w-4 accent-black"
                        />
                        <span className="text-sm font-bold text-slate-700 dark:text-gray-500">
                          Включить кастомную мышку
                        </span>
                      </label>

                      <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${isCustomCursorDisabled
                        ? "border-brand bg-brand/10"
                        : "border-slate-200 bg-white dark:border-white/5 dark:bg-[#111111]"
                        }`}>
                        <input
                          type="radio"
                          name="customCursor"
                          checked={isCustomCursorDisabled}
                          onChange={() => handleCursorDisabledChange(true)}
                          className="h-4 w-4 accent-black"
                        />
                        <span className="text-sm font-bold text-slate-700 dark:text-gray-500">
                          Отключить кастомную мышку
                        </span>
                      </label>

                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 pb-20">
              <button type="submit" disabled={saving} className="px-10 py-4 bg-brand text-white font-black uppercase tracking-tighter rounded-lg shadow-lg shadow-[#2EC4B6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                {saving ? "СОХРАНЕНИЕ..." : "Сохранить профиль"}
              </button>
              <button type="button" onClick={() => router.push("/profile")} className="px-10 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 font-bold uppercase tracking-tighter rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
                Отмена
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
