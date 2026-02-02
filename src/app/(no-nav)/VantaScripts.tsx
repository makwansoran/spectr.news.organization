'use client';

import Script from 'next/script';

const P5_URL = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js';

/** Load p5.js early so Vanta effect can start faster on login/sign-up. */
export function VantaScripts() {
  return <Script src={P5_URL} strategy="afterInteractive" />;
}
