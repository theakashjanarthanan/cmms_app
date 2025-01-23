import React from 'react';
import ReactDOM from 'react-dom/client';  // Import from 'react-dom/client' for React 18
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './styles/styles.css';

// Create a root and render the App inside it
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
        <App />
    </AuthProvider>
);
