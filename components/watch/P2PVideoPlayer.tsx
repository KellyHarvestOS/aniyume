"use client";

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface P2PVideoPlayerProps {
  src: string;
}

export default function P2PVideoPlayer({ src }: P2PVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [engineLoaded, setEngineLoaded] = useState(false);
  const engineRef = useRef<any>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    let unmounted = false;
    
    // Dynamic import to avoid SSR issues with P2P Media Loader
    const initPlayer = async () => {
      try {
        const { HlsJsP2PEngine } = await import('p2p-media-loader-hlsjs');

        if (unmounted) return;

        if (Hls.isSupported()) {
          const HlsWithP2P = HlsJsP2PEngine.injectMixin(Hls as any);
          
          const hls = new HlsWithP2P({
            liveSyncDurationCount: 7,
          });
          
          hlsRef.current = hls as any;
          const engine = hls.p2pEngine;
          engineRef.current = engine as any;

          if (videoRef.current) {
            hls.attachMedia(videoRef.current);
            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
              hls.loadSource(src);
            });
          }
          
          engine.addEventListener('onChunkDownloaded', (bytesDownloaded: number, dlSource: string) => {
             // For debugging/demo purposes to show P2P happens
             // if (dlSource === 'p2p') console.log(`[P2P] Downloaded ${bytesDownloaded} bytes`);
          });

          setEngineLoaded(true);
        } else if (videoRef.current && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          // Fallback for native HLS (Safari etc)
          videoRef.current.src = src;
        }
      } catch (err) {
        console.error("Failed to init P2P HLS Player", err);
      }
    };

    initPlayer();

    return () => {
      unmounted = true;
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, [src]);

  return (
    <div className="relative w-full h-full bg-black group">
      <video
        ref={videoRef}
        controls
        className="w-full h-full outline-none"
        crossOrigin="anonymous"
      />
      {engineLoaded && (
        <div className="absolute top-4 left-4 bg-black/60 text-xs font-bold text-[#2EC4B6] px-3 py-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#2EC4B6] animate-pulse shadow-[0_0_8px_#2EC4B6]"></span>
          P2P NETWORK ACTIVE
        </div>
      )}
    </div>
  );
}
