"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import EditProfileSkeleton from "@/components/skeletons/EditProfileSkeleton";
import { FaPencilAlt, FaUser, FaQuoteLeft, FaInfoCircle, FaChevronLeft, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import ImageCropModal from "@/components/modals/ImageCropModal";
import { AnimatePresence } from "framer-motion";

export default function EditProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    status_text: "",
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  useEffect(() => {
    const fetchCurrentData = async () => {
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

          const avatar = user.avatar || user.avatar_url;
          if (avatar) {
            const baseUrl = "http://164.90.185.95/storage/";
            const fullUrl = avatar.startsWith("http") ? avatar : `${baseUrl}${avatar}`;
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

    const previewUrl = URL.createObjectURL(croppedBlob);
    setPreviewUrl(previewUrl);

    setIsCropOpen(false);
    setTempImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("userToken");

      const profileRes = await fetch("/api/external/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          custom_status: formData.status_text,
          bio: formData.bio,
        }),
      });

      if (!profileRes.ok) {
        const debugText = await profileRes.clone().text();
        console.log("ОШИБКА PUT PROFILE:", debugText);
        throw new Error("Ошибка обновления данных профиля");
      }


      if (selectedFile) {
        const avatarData = new FormData();
        avatarData.append("avatar", selectedFile);

        const avatarRes = await fetch("/api/external/profile/me/avatar", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          },
          body: avatarData,
        });

        if (!avatarRes.ok) {
          const debugText = await avatarRes.clone().text();
          console.log("ОШИБКА POST AVATAR:", debugText);

          const errData = await avatarRes.json().catch(() => ({}));
          throw new Error(errData.errors?.avatar?.[0] || "Ошибка загрузки аватара");
        } else {
          const successData = await avatarRes.json();
          console.log("УСПЕХ AVATAR:", successData);
        }
      }

      setMessage({ type: "success", text: "Профиль успешно обновлен!" });
      setTimeout(() => {
        router.refresh();
        router.push("/profile");
      }, 1500);
    } catch (err: any) {
      console.error("CATCH ERROR:", err);
      setMessage({ type: "error", text: err.message || "Не удалось сохранить" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <EditProfileSkeleton />;

  return (

    <div className="flex-1 w-full bg-white dark:bg-[#111111] flex flex-col transition-colors duration-300 overflow-hidden">

      <div className="w-full border-b border-slate-300 dark:border-white/15 bg-slate-50/50 dark:bg-[#111111]/50 backdrop-blur-md px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-[#2EC4B6] transition-all font-bold text-sm"
        >
          <FaChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          ВЕРНУТЬСЯ В ПРОФИЛЬ
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">

        <div className="hidden lg:flex w-72 border-r border-slate-300 dark:border-white/15 p-10 flex-col gap-6 bg-slate-50/30 dark:bg-[#111111]">
          <h1 className="text-4xl font-black text-[#2EC4B6] tracking-tighter italic">
            Настройки
          </h1>
          <h1 className="text-4xl font-black text-black dark:text-white  tracking-tighter italic -mt-5">
            профиля
          </h1>
          <p className="text-xs text-slate-500 dark:text-gray-400 font-medium leading-relaxed">
            Настройте свой профиль так, чтобы он выделялся. Ваши данные обновятся мгновенно.
          </p>
        </div>

        <AnimatePresence>
          {isCropOpen && tempImage && (
            <ImageCropModal
              image={tempImage}
              onCropComplete={handleCropSave}
              onClose={() => setIsCropOpen(false)}
            />
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl w-full mx-auto p-6 md:p-12 space-y-12">

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 pb-10 border-b border-slate-100 dark:border-white/5">
              <div className="relative group">
                <div className="absolute -inset-2 bg-[#2EC4B6] rounded-full blur opacity-10 group-hover:opacity-30 transition duration-700"></div>
                <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#2EC4B6] shadow-xl">
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="avatar" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-[#1a1a1a] flex items-center justify-center text-slate-400 dark:text-white text-4xl font-bold">
                      {formData.name[0]?.toUpperCase()}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <FaPencilAlt className="text-[#2EC4B6] w-6 h-6 mb-1" />
                    <span className="text-[10px] font-black text-white uppercase">Изменить</span>
                  </button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Фото профиля</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 max-w-sm">
                  Используйте уникальное изображение. <br className="hidden md:block" />
                  Поддерживаются <span className="text-[#2EC4B6] font-bold">JPG • PNG</span>.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.15em] ml-1">
                  <FaUser className="text-[#2EC4B6]" /> Никнейм
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-white/5 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]/50 focus:bg-white dark:focus:bg-[#1a1a1a] transition-all shadow-sm"
                  placeholder="Ваше имя"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.15em] ml-1">
                  <FaQuoteLeft className="text-[#2EC4B6]" /> Статус
                </label>
                <input
                  type="text"
                  value={formData.status_text}
                  onChange={(e) => setFormData({ ...formData, status_text: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-white/5 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]/50 focus:bg-white dark:focus:bg-[#1a1a1a] transition-all shadow-sm"
                  placeholder="Ваш статус"
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.15em] ml-1">
                  <FaInfoCircle className="text-[#2EC4B6]" /> О себе
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={5}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-white/5 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]/50 focus:bg-white dark:focus:bg-[#1a1a1a] transition-all shadow-sm resize-none"
                  placeholder="Расскажите вашу историю..."
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 pb-20">
              <button
                type="submit"
                disabled={saving}
                className="px-10 py-4 bg-linear-to-r from-[#2EC4B6] to-[#26a69a] text-white dark:text-black font-black uppercase tracking-tighter rounded-lg shadow-lg shadow-[#2EC4B6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {saving ? "СОХРАНЕНИЕ..." : "Сохранить профиль"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="px-10 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 font-bold uppercase tracking-tighter rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
              >
                Отмена
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};