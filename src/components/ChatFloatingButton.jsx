import { useState } from 'react';
import AIChat from '../pages/AIChat';
import { MessageSquare } from 'lucide-react';

export default function ChatFloatingButton() {
  const [open, setOpen] = useState(false);

  // Handler to close modal when clicking the background
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-white/20 hover:bg-blue-100/60 text-blue-400 rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none backdrop-blur-md transition-all duration-150 border border-blue-100"
        aria-label="Open AI Chat"
        style={{ boxShadow: '0 4px 16px 0 rgba(80, 140, 255, 0.12)' }}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-[8px]"
          onClick={handleBackgroundClick}
        >
          <div className="bg-white/90 rounded-[2.5rem] shadow-2xl border border-blue-100 max-w-2xl w-full relative p-0">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-4 text-gray-400 hover:text-gray-700 text-3xl font-bold focus:outline-none z-10"
              aria-label="Close AI Chat"
              style={{ background: 'none' }}
            >
              ×
            </button>
            <div className="p-0">
              <AIChat />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 