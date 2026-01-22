import React from 'react';
import { createRoot } from 'react-dom/client';

const el = document.getElementById('root');

if (!el) {
  document.body.innerHTML = '<div style="color:red;font-size:24px;padding:40px">NO #root FOUND</div>';
} else {
  createRoot(el).render(
    <div style={{ color: 'white', padding: 40, fontSize: 20 }}>
      <h1>ALGO BOOT OK</h1>
      <p>If you can see this, JS is loading and React is mounted.</p>
    </div>
  );
}
