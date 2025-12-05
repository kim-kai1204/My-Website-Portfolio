import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
// 개발 환경에서는 basename을 설정하지 않음 (또는 '/')
// 배포 환경에서만 '/My-Website-Portfolio' 사용
const basename = import.meta.env.PROD ? '/My-Website-Portfolio' : undefined;

root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);