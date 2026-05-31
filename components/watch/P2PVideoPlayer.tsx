"use client";

import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface P2PVideoPlayerProps {
  src: string;
}

export default function P2PVideoPlayer({ src }: P2PVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
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
    </div>
  );
}
