### Interactive AI Assistant Script (scripts/ask-ai-bot.sh)
#!/bin/bash
# Interactive AI assistant for PMERIT development

QUESTION="$1"
if [ -z "$QUESTION" ]; then
    echo "Usage: ./ask-ai-bot.sh 'Your question about the platform'"
    exit 1
fi

echo "🤖 PMERIT AI Assistant: Analyzing your question..."

node -e "
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

(async () => {
    const response = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages: [{
            role: 'system',
            content: 'You are an expert AI consultant for the PMERIT Educational Platform, focused on breaking poverty cycles through accessible education in Nigeria/Africa. Provide specific, actionable technical advice.'
        }, {
            role: 'user',
            content: '$QUESTION'
        }],
        max_tokens: 1000
    });
    
    console.log('💡 AI Recommendation:');
    console.log(response.choices[0].message.content);
})();
