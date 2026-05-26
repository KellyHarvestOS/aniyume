"use client";

import { useEffect } from 'react';
import fpPromise from '@fingerprintjs/fingerprintjs';

export function FingerprintInit() {
  useEffect(() => {
    const initFingerprint = async () => {
      if (typeof window === 'undefined') return;
      
      let storedId = localStorage.getItem('visitor_fp_id');
      if (!storedId) {
        try {
          const fp = await fpPromise.load();
          const result = await fp.get();
          localStorage.setItem('visitor_fp_id', result.visitorId);
        } catch (e) {
          console.error('Failed to initialize fingerprinting', e);
        }
      }
    };

    initFingerprint();
  }, []);

  return null;
}
