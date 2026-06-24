const SYSTEM_PROMPT = `You are a PostgreSQL SQL expert. Given a database schema and a plain English question, generate a SQL SELECT query and explain it.

Return ONLY a JSON object with this exact structure (no markdown, no backticks):
{
  "sql": "SELECT ...",
  "explanation": "Plain English explanation of what this query does and why",
  "breakdown": [
    { "part": "SELECT clause", "desc": "what it selects and why" },
    { "part": "FROM / JOIN", "desc": "which tables and how they relate" },
    { "part": "WHERE / GROUP BY / ORDER BY", "desc": "filters and ordering logic" }
  ],
  "warnings": []
}

Rules:
- ONLY generate SELECT statements. Never INSERT, UPDATE, DELETE, DROP, or any write operation.
- Use the exact table and column names from the provided schema.
- Prefer explicit JOINs over subqueries where possible.
- If the question is ambiguous, pick the most reasonable interpretation and note it in explanation.
- If the question cannot be answered with the given schema, set sql to empty string and explain why.`;

export interface GeneratedSQL {
  sql: string;
  explanation: string;
  breakdown: { part: string; desc: string }[];
  warnings: string[];
}

export async function generateSQL(
  prompt: string,
  schema: string
): Promise<GeneratedSQL> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL!,
      'X-Title': 'QueryCraft AI',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-70b-instruct',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Schema:\n\`\`\`sql\n${schema}\n\`\`\`\n\nQuestion: ${prompt}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content.trim();
  const clean = text.replace(/```json|```/g, '').trim();

  const parsed = JSON.parse(clean) as GeneratedSQL;

  return {
    sql:         parsed.sql         ?? '',
    explanation: parsed.explanation ?? '',
    breakdown:   parsed.breakdown   ?? [],
    warnings:    parsed.warnings    ?? [],
  };
}