import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

// Get Google Client ID from environment variable or use a fallback
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "placeholder";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  const root = createRoot(rootElement);
  
  // Only wrap with GoogleOAuthProvider if we have a valid client ID
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== "placeholder") {
    root.render(
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    );
  } else {
    // Render without Google OAuth if no client ID is provided
    console.warn("Google OAuth Client ID not configured. OAuth features will be disabled.");
    root.render(<App />);
  }
} catch (error) {
  console.error("Failed to render app:", error);
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>App Loading Error</h1>
      <p>There was an error loading the application. Please check the console for details.</p>
      <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>
  `;
}