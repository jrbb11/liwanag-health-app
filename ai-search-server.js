import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/ai-search', async (req, res) => {
  const { query, items } = req.body;
  if (!query || !items) return res.status(400).json({ error: 'Missing query or items' });

  // Get embeddings for all items and the query
  const texts = [query, ...items.map(i => i.name)];
  const embeddings = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: texts,
  });

  const queryEmbedding = embeddings.data[0].embedding;
  const itemEmbeddings = embeddings.data.slice(1).map(e => e.embedding);

  // Cosine similarity
  function cosine(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Find best match
  let bestIdx = 0, bestScore = -1;
  itemEmbeddings.forEach((emb, i) => {
    const score = cosine(queryEmbedding, emb);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  });

  res.json({ match: items[bestIdx], score: bestScore });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`AI search server running on port ${PORT}`));