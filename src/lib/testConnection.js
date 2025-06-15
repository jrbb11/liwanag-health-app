// src/pages/TestConnection.jsx

import supabase from './supabaseClient';
import { getGPTResponse } from '../services/gpt';

/**
 * Tests connections to Supabase and OpenAI GPT.
 * Logs and returns connection status.
 */
export async function testConnections() {
  const result = {
    success: true,
    supabase: null,
    gpt: null,
    gptResponse: null,
    error: null,
  };

  try {
    // 🔹 Test Supabase
    console.log('🔍 Testing Supabase connection...');
    const { error: supabaseError } = await supabase
      .from('chat_messages')
      .select('id')
      .limit(1);

    if (supabaseError) {
      result.supabase = 'failed';
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }

    result.supabase = 'connected';
    console.log('✅ Supabase connected');

    // 🔹 Test GPT
    console.log('🔍 Testing GPT connection...');
    const message = 'Hello, can you confirm you can access hospital and procedure data?';
    const gptResponse = await getGPTResponse(message);

    result.gpt = 'connected';
    result.gptResponse = gptResponse;
    console.log('✅ GPT connected');
    console.log('🧠 GPT Response:', gptResponse);

  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
    result.success = false;
    result.error = err.message;
  }

  return result;
}
