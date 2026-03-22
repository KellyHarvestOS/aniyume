'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { motion } from 'framer-motion';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

interface ImageCropModalProps {
    image: string;
    onCropComplete: (croppedImage: Blob) => void;
    onClose: () => void;
}

export default function ImageCropModal({ image, onCropComplete, onClose }: ImageCropModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropChange = (crop: { x: number; y: number }) => setCrop(crop);
    const onZoomChange = (zoom: number) => setZoom(zoom);

    const onCropCompleteInternal = useCallback((_: any, scrolledPixels: any) => {
        setCroppedAreaPixels(scrolledPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async () => {
        try {
            const img = await createImage(image);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.drawImage(
                img,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            canvas.toBlob((blob) => {
                if (blob) onCropComplete(blob);
            }, 'image/jpeg');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="relative w-full max-w-lg bg-white dark:bg-[#111111] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
                {/* Header */}
                <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-[#161616]">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                        Редактирование фото
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Crop Area */}
                <div className="relative w-full h-80 bg-[#0a0a0a]">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteInternal}
                        onZoomChange={onZoomChange}
                        showGrid={false}
                    />
                </div>

                {/* Controls */}
                <div className="p-6 space-y-6 bg-white dark:bg-[#111111]">
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                            <span>Масштаб</span>
                            <span className="text-[#2EC4B6]">{Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => onZoomChange(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2EC4B6]"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={getCroppedImg}
                            className="flex-1 py-3 bg-[#2EC4B6] text-white dark:text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <FaCheck /> Применить
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 font-black uppercase text-xs tracking-widest rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}