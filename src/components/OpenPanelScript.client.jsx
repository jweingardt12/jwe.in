'use client'

import Script from 'next/script'

export function OpenPanelScript() {
  return (
    <Script
      id="openpanel"
      src="https://openpanel.dev/op1.js"
      onLoad={() => {
        window.op = window.op || function() {
          (window.op.q = window.op.q || []).push(arguments);
        };
        window.op('init', {
          clientId: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID
        });
      }}
    />
  )
}
