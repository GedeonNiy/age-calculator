/**
 * Smart Tools Chat Widget Component
 * 
 * Floating chat assistant that helps users choose tools and perform calculations
 */

import React, { useState, useEffect, useRef } from 'react';
import '../styles/chatWidget.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  reply: string;
  usage: {
    model: string;
    promptTokens: number | null;
    completionTokens: number | null;
  };
}

interface ChatErrorResponse {
  error: string;
}

const STORAGE_KEY = 'smartToolsChatHistory';

// Map routes to tool slugs
function getToolSlugFromRoute(): string | null {
  const path = window.location.pathname;
  const routeMap: Record<string, string> = {
    '/age-calculator': 'age',
    '/date-difference': 'date-difference',
    '/pregnancy-due-date': 'pregnancy-due-date',
    '/mortgage-calculator': 'mortgage',
    '/car-loan-calculator': 'car-loan',
    '/bmi-calculator': 'bmi',
    '/gpa-calculator': 'gpa',
    '/compound-interest': 'compound-interest',
    '/income-tax': 'income-tax',
    '/income-tax-calculator': 'income-tax',
    '/currency-converter': 'currency-converter',
  };
  return routeMap[path] || null;
}

// Quick tool suggestions
const QUICK_TOOLS = [
  { name: 'Age Tool', route: '/age-calculator' },
  { name: 'Mortgage Tool', route: '/mortgage-calculator' },
  { name: 'Car Loan Tool', route: '/car-loan-calculator' },
  { name: 'Compound Interest Tool', route: '/compound-interest' },
  { name: 'Currency Converter', route: '/currency-converter' },
];

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hi, I'm Dyla 👋. Tell me what you want to calculate (age, mortgage, car loan, BMI, savings, tax, currency, etc.) and I'll help you and point you to the right tool.",
};

/**
 * Format message content to render markdown links as HTML
 * Converts markdown links [text](url) to clickable HTML links
 */
function formatMessageContent(content: string): string {
  // Escape HTML to prevent XSS
  let escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Convert markdown links [text](url) to HTML links
  escaped = escaped.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-widget-link">$1</a>'
  );

  // Convert line breaks
  escaped = escaped.replace(/\n/g, '<br>');

  // Convert bullet points (•) to proper list items
  escaped = escaped.replace(/•\s+/g, '• ');

  return escaped;
}

export default function SmartToolsChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Clear localStorage and start fresh on mount - NO automatic restoration
  useEffect(() => {
    // Remove old chat history from localStorage on every page load
    localStorage.removeItem(STORAGE_KEY);
    // Always start with initial message - do NOT restore from localStorage
    setMessages([INITIAL_MESSAGE]);
  }, []);

  // REMOVED: No longer saving messages to localStorage
  // REMOVED: No longer restoring messages from localStorage
  // Each page load starts with a completely fresh conversation

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageText.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const toolSlug = getToolSlugFromRoute();
      const history = messages
        .filter((m) => m.role !== 'assistant' || m.content !== INITIAL_MESSAGE.content)
        .map((m) => ({ role: m.role, content: m.content }));

      console.log('[ChatWidget] Sending message to /api/chat');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText.trim(),
          history,
          toolSlug,
        }),
      });

      console.log('[ChatWidget] Response status:', response.status, response.statusText);
      console.log('[ChatWidget] Response headers:', Object.fromEntries(response.headers.entries()));

      let data: ChatResponse | ChatErrorResponse | null = null;
      const text = await response.text();
      console.log('[ChatWidget] Response text (first 500 chars):', text.substring(0, 500));
      
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('[ChatWidget] Failed to parse response JSON:', parseError);
        console.error('[ChatWidget] Response was not JSON. Full response:', text.substring(0, 1000));
        throw new Error('Invalid response from server. The API may not be configured correctly.');
      }

      if (!response.ok) {
        console.error('[ChatWidget] Request failed:', response.status, data);
        const errorData = data as ChatErrorResponse;
        const errorMsg = errorData?.error || response.statusText || 'Unexpected server error. Please try again.';
        setError(errorMsg);
        const errorMessage: Message = {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${errorMsg}`,
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
        return;
      }

      // Success - add assistant message
      const successData = data as ChatResponse;
      const assistantMessage: Message = { role: 'assistant', content: successData.reply };
      setMessages((prev) => [...prev, assistantMessage]);
      console.log('[ChatWidget] Message sent successfully');
    } catch (err: any) {
      console.error('[ChatWidget] Error sending message:', err);
      const errorMsg = err?.message || 'Failed to send message. Please check your connection and try again.';
      setError(errorMsg);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMsg}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleQuickToolClick = (route: string, name: string) => {
    // Navigate to the tool page
    window.location.href = route;
    // Optionally send a message about the tool
    setTimeout(() => {
      sendMessage(`How do I use the ${name} on this page?`);
    }, 500);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          className="chat-widget-button"
          onClick={() => setIsOpen(true)}
          aria-label="Ask Dyla - AI Assistant"
          title="Ask Dyla"
          type="button"
        >
          <span className="chat-widget-button-text">Ask Dyla</span>
          <svg
            className="chat-widget-button-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-widget-panel">
          {/* Header */}
          <div className="chat-widget-header">
            <h3>Ask Dyla</h3>
            <div className="chat-widget-header-actions">
              <button
                type="button"
                onClick={clearChat}
                className="chat-widget-clear-btn"
                aria-label="Clear chat"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="chat-widget-close-btn"
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </div>

          {/* Quick Tool Suggestions */}
          <div className="chat-widget-quick-tools">
            {QUICK_TOOLS.map((tool) => (
              <button
                key={tool.route}
                type="button"
                className="chat-widget-quick-tool-btn"
                onClick={() => handleQuickToolClick(tool.route, tool.name)}
              >
                {tool.name}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="chat-widget-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-widget-message chat-widget-message-${msg.role}`}
              >
                <div 
                  className="chat-widget-message-content"
                  dangerouslySetInnerHTML={{ __html: formatMessageContent(msg.content) }}
                />
              </div>
            ))}
            {isLoading && (
              <div className="chat-widget-message chat-widget-message-assistant">
                <div className="chat-widget-message-content">
                  <span className="chat-widget-loading">Thinking...</span>
                </div>
              </div>
            )}
            {error && (
              <div className="chat-widget-error">{error}</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="chat-widget-input-form">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about any tool or calculation..."
              className="chat-widget-input"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="chat-widget-send-btn"
              aria-label="Send message"
              title="Send"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

