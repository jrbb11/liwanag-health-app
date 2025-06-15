import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { getGPTResponse, formatMessageForGPT } from '../services/gpt';
import { hospitals } from '../data/hospitals';
import { procedures } from '../data/procedures';
import { Send, Loader2, Bot, User, Mic, Paperclip } from 'lucide-react';
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

export default function AIChat() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

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
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Add user message to UI immediately
      const userMessageObj = {
        role: 'user',
        content: userMessage,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessageObj]);

      // Save user message to Supabase
      const { error: saveError } = await supabase
        .from('chat_messages')
        .insert([{
          role: 'user',
          content: userMessage,
          hospital_id: selectedHospital?.id,
          procedure_id: selectedProcedure?.id,
          session_id: sessionId
        }]);

      if (saveError) throw saveError;

      // Get GPT response
      const formattedMessage = formatMessageForGPT(userMessage, {
        hospital: selectedHospital,
        procedure: selectedProcedure
      });
      // Pass the Tagalog-ready system prompt
      const gptResponse = await getGPTResponse(formattedMessage, { systemPrompt: SYSTEM_PROMPT });

      // Add assistant message to UI
      const assistantMessageObj = {
        role: 'assistant',
        content: gptResponse,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessageObj]);

      // Save assistant message to Supabase
      const { error: saveAssistantError } = await supabase
        .from('chat_messages')
        .insert([{
          role: 'assistant',
          content: gptResponse,
          hospital_id: selectedHospital?.id,
          procedure_id: selectedProcedure?.id,
          session_id: sessionId
        }]);

      if (saveAssistantError) throw saveAssistantError;

    } catch (error) {
      console.error('Error in chat:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-blue-100 py-8 px-2">
      <div className="w-full max-w-2xl mx-auto rounded-[2.5rem] shadow-2xl bg-white/90 backdrop-blur-lg border border-blue-100 p-0 flex flex-col relative h-[80vh] min-h-[600px]">
        {/* Welcome/Intro Section */}
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 h-full">
            <Bot className="w-14 h-14 text-blue-300 mb-4 drop-shadow-md" />
            <h2 className="text-3xl font-extrabold mb-2 text-gray-800 tracking-tight text-center">Welcome to Liwanag Health AI Chat</h2>
            <p className="text-gray-500 mb-8 text-center max-w-md text-lg font-medium">
              Ask about healthcare costs, procedures, or hospitals in English or Tagalog. Try a suggestion below!
            </p>
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full px-5 py-2 text-base font-semibold shadow transition-all duration-150 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  style={{ boxShadow: '0 2px 8px 0 rgba(80, 140, 255, 0.08)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6" style={{ minHeight: 0 }}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`relative max-w-[80%] px-5 py-4 rounded-2xl shadow-lg text-base whitespace-pre-wrap
                  ${message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-400 text-white rounded-br-md'
                    : 'bg-white/80 text-gray-900 border border-blue-100 rounded-bl-md'}
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === 'assistant' ? (
                    <Bot className="h-5 w-5 text-blue-400" />
                  ) : (
                    <User className="h-5 w-5 text-blue-100" />
                  )}
                  <span className="text-xs font-semibold">
                    {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                  </span>
                </div>
                <p>{message.content}</p>
              </div>
            </div>
          ))}
          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 bg-white/80 border border-blue-100 rounded-2xl px-5 py-3 shadow animate-pulse">
                <Bot className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-gray-500">Analyzing data, please wait...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Floating Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="sticky bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-blue-100 flex items-center gap-3 px-6 py-4 rounded-b-[2.5rem] shadow-lg z-10"
        >
          <button
            type="button"
            onClick={handleMicClick}
            className={`p-3 rounded-full ${listening ? 'bg-blue-100 text-blue-600' : 'bg-white text-blue-400 hover:bg-blue-50'} shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300`}
            aria-label="Voice input"
            disabled={loading}
          >
            <Mic className="w-6 h-6" />
          </button>
          <button
            type="button"
            className="p-3 rounded-full bg-white text-blue-300 hover:bg-blue-50 shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Attach file (coming soon)"
            disabled
          >
            <Paperclip className="w-6 h-6" />
          </button>
          <input
            type="text"
            className="flex-1 border-none bg-transparent focus:ring-0 px-4 py-3 text-lg placeholder-blue-200 outline-none rounded-full"
            placeholder="Ask, write or search for anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
            disabled={loading || !input.trim()}
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
        {error && (
          <div className="p-2 text-red-600 text-sm text-center">{error}</div>
        )}
      </div>
    </div>
  );
} 