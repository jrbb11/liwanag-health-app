import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { getGPTResponse, formatMessageForGPT } from '../services/gpt';
import { hospitals } from '../data/hospitals';
import { procedures } from '../data/procedures';
import { Send, Loader2, Bot, User, Mic, Paperclip, Smile, X, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const SYSTEM_PROMPT = `You are a healthcare cost estimation assistant. You have access to information about hospitals and medical procedures in the Philippines. 
Your role is to help users understand healthcare costs and provide accurate estimates based on the available data.

Guidelines:
1. Always provide accurate cost estimates based on the available data
2. Explain the factors that affect costs (hospital type, PhilHealth coverage, etc.)
3. Be clear about what is included in the estimates
4. If asked about procedures or hospitals not in the database, explain that you can only provide information about the listed items
5. When discussing costs, always mention both public and private hospital options
6. Include information about PhilHealth coverage when relevant
7. Be professional but friendly in your responses
8. If you're unsure about something, be honest about it
9. If the user writes or speaks in Tagalog, respond in Tagalog.`;

const SUGGESTIONS = [
  'Estimate cost for appendectomy',
  'List hospitals with PhilHealth',
  'Magkano ang normal delivery?',
  'Show private hospitals in Manila',
];

const SESSION_KEY = 'liwanag_chat_session_id';
let sessionId = localStorage.getItem(SESSION_KEY);
if (!sessionId) {
  sessionId = uuidv4();
  localStorage.setItem(SESSION_KEY, sessionId);
}

const MESSAGE_LIMIT = 5;
const MESSAGE_COUNT_KEY = 'liwanag_user_message_count';

export default function AIChat({ onClose, onLogin, onRegister }) {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [listening, setListening] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const recognitionRef = useRef(null);
  const [userMessageCount, setUserMessageCount] = useState(() => {
    const stored = localStorage.getItem(MESSAGE_COUNT_KEY);
    return stored ? parseInt(stored, 10) : 0;
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hospitalId = params.get('hospitalId');
    const procedureId = params.get('procedureId');

    if (hospitalId) {
      const hospital = hospitals.find(h => h.id === parseInt(hospitalId));
      if (hospital) setSelectedHospital(hospital);
    }

    if (procedureId) {
      const procedure = procedures.find(p => p.id === parseInt(procedureId));
      if (procedure) setSelectedProcedure(procedure);
    }

    loadChatHistory();
  }, [location]);

  const loadChatHistory = async () => {
    try {
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(messages || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setError('Failed to load chat history');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Voice message (speech-to-text) logic
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US'; // You can set to 'fil-PH' for Tagalog
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
      };
      recognitionRef.current.onerror = (event) => {
        setListening(false);
        alert('Speech recognition error: ' + event.error);
      };
      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }
    setListening(true);
    recognitionRef.current.start();
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || userMessageCount >= MESSAGE_LIMIT) return;
    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setError(null);
    try {
      const userMessageObj = {
        role: 'user',
        content: userMessage,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessageObj]);
      setUserMessageCount((count) => {
        const newCount = count + 1;
        localStorage.setItem(MESSAGE_COUNT_KEY, newCount);
        return newCount;
      });
      await supabase.from('chat_messages').insert([
        { role: 'user', content: userMessage, session_id: sessionId },
      ]);
      const formattedMessage = formatMessageForGPT(userMessage, {});
      const gptResponse = await getGPTResponse(formattedMessage);
      const assistantMessageObj = {
        role: 'assistant',
        content: gptResponse,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessageObj]);
      await supabase.from('chat_messages').insert([
        { role: 'assistant', content: gptResponse, session_id: sessionId },
      ]);
    } catch (error) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-emerald-600 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-full p-1 w-10 h-10 flex items-center justify-center">
            <Bot className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <div className="font-bold text-base leading-tight">Chat with Liwanag Health AI</div>
            <div className="text-xs text-emerald-100 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span> We're online
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-emerald-700/30 rounded-full" aria-label="Settings">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-emerald-700/30 rounded-full" aria-label="Close" onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-blue-50" style={{ minHeight: 0 }}>
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-10">
            <Bot className="w-12 h-12 text-emerald-400 mb-3" />
            <div className="font-bold text-lg mb-1">Welcome to Liwanag Health AI Chat</div>
            <div className="mb-4 text-sm">Ask about healthcare costs, procedures, or hospitals in English or Tagalog.</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="bg-white hover:bg-emerald-100 text-emerald-600 rounded-full px-3 py-1 text-xs font-semibold border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 shadow"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl shadow text-sm whitespace-pre-wrap
                ${message.role === 'user'
                  ? 'bg-gradient-to-br from-emerald-600 to-emerald-500 text-white rounded-br-md'
                  : 'bg-white text-gray-900 border border-emerald-100 rounded-bl-md'}
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.role === 'assistant' ? (
                  <Bot className="h-4 w-4 text-emerald-500" />
                ) : (
                  <User className="h-4 w-4 text-emerald-200" />
                )}
                <span className="text-xs font-semibold">
                  {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                </span>
              </div>
              <p>{message.content}</p>
              {/* Quick replies for bot messages (example) */}
              {message.role === 'assistant' && index === messages.length - 1 && SUGGESTIONS.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-full px-3 py-1 text-xs font-semibold border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 shadow"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 bg-white border border-emerald-100 rounded-2xl px-4 py-2 shadow animate-pulse">
              <Bot className="h-4 w-4 text-emerald-500" />
              <span className="text-xs text-gray-500">Analyzing data, please wait...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-3 py-2 bg-white border-t border-blue-100"
      >
        <button
          type="button"
          className="p-2 rounded-full hover:bg-emerald-50 text-emerald-500"
          aria-label="Emoji picker"
          onClick={() => setShowEmoji(!showEmoji)}
          disabled={userMessageCount >= MESSAGE_LIMIT}
        >
          <Smile className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="p-2 rounded-full hover:bg-emerald-50 text-emerald-500"
          aria-label="Attach file (coming soon)"
          disabled
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="text"
          className="flex-1 border-none bg-transparent focus:ring-0 px-2 py-2 text-sm placeholder-blue-200 outline-none rounded-full"
          placeholder="Enter your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading || userMessageCount >= MESSAGE_LIMIT}
        />
        <button
          type="submit"
          className="bg-gradient-to-br from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-4 py-2 rounded-full font-bold shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-50 text-sm"
          disabled={loading || !input.trim() || userMessageCount >= MESSAGE_LIMIT}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
      {userMessageCount >= MESSAGE_LIMIT && (
        <div className="flex flex-col items-center gap-2 py-3">
          <div className="text-emerald-700 text-xs text-center font-semibold mb-1">
            Please log in to continue chatting with the AI.
          </div>
          <div className="flex gap-2">
            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1 rounded font-semibold text-xs shadow focus:outline-none focus:ring-2 focus:ring-emerald-300"
              onClick={onLogin || (() => { window.location.href = '/login'; })}
            >
              Log in
            </button>
            <button
              className="bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-4 py-1 rounded font-semibold text-xs shadow focus:outline-none focus:ring-2 focus:ring-emerald-300"
              onClick={onRegister || (() => { window.location.href = '/register'; })}
            >
              Register
            </button>
          </div>
        </div>
      )}
      {error && (
        <div className="p-2 text-red-600 text-xs text-center">{error}</div>
      )}
    </div>
  );
} 