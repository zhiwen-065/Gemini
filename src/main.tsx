import React from 'react';
import { createRoot } from 'react-dom/client';

const el = document.getElementById('root');

if (!el) {
  document.body.innerHTML = '<div style="color:red;font-size:24px;padding:40px">NO #root FOUND</div>';
} else {
  // 让背景变黑，确保你能看见
  document.body.style.margin = '0';
  document.body.style.background = '#000';

  createRoot(el).render(
    <div style={{ color: '#00ff7f', padding: 40, fontSize: 20, fontFamily: 'monospace' }}>
      <h1>ALGO BOOT OK ✅</h1>
      <p>JS loaded + React mounted.</p>
      <div style={{ marginTop: 16, padding: 12, border: '1px solid #00ff7f' }}>
        timestamp: {Date.now()}
      </div>
    </div>
  );
}
