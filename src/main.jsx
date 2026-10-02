import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Fonts are bundled locally so the site looks right even without internet during a presentation.
import '@fontsource-variable/inter';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/fraunces/wght-italic.css';
import './styles/global.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
