import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthWrapper from './auth/AuthWrapper.jsx';

createRoot(document.getElementById('root')).render(
  <AuthWrapper>
    <App />
  </AuthWrapper>
);
