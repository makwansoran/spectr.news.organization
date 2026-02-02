'use client';

import { useEffect, useRef } from 'react';

export function ViewTracker() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    fetch('/api/analytics/view', { method: 'POST', keepalive: true }).catch(() => {});
  }, []);

  return null;
}
