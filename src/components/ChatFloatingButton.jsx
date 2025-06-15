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
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] max-w-md h-[80vh] sm:w-[400px] sm:h-[600px] flex flex-col shadow-2xl"
        >
          <AIChat onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
} 