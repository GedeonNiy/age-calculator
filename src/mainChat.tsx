/**
 * Chat Widget Entry Point
 * Renders the React chat widget into the app
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import SmartToolsChatWidget from './components/SmartToolsChatWidget';

// Initialize chat widget when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create a container for the chat widget
  const chatContainer = document.createElement('div');
  chatContainer.id = 'chat-widget-root';
  document.body.appendChild(chatContainer);

  // Render React component
  const root = createRoot(chatContainer);
  root.render(
    <React.StrictMode>
      <SmartToolsChatWidget />
    </React.StrictMode>
  );
});

