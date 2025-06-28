import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Platform } from 'react-native';

// Only load PWA elements on web
if (Platform.OS === 'web') {
  import('@ionic/pwa-elements/loader').then(({ defineCustomElements }) => {
    defineCustomElements(window);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);