#!/bin/bash
# =================================================================
# PMERIT Educational Platform AI Assistant
# Interactive educational platform helper for developers & educators
# =================================================================

QUESTION="$1"

if [ -z "$QUESTION" ]; then
  cat << EOF
🎓 PMERIT Educational Platform AI Assistant

Usage: ./ask-ai-bot.sh 'Your question about the platform'

Example questions:
  • 'How to improve student registration flow?'
  • 'Optimize platform for Nigerian mobile users'
  • 'Implement offline learning capabilities'
  • 'Secure student data according to GDPR'
  • 'Best practices for educational accessibility'
EOF
  exit 1
fi

echo ""
echo "🤖 PMERIT AI Assistant: Analyzing your question..."
echo "🎓 Context: Accessible education for underserved communities"
echo ""

if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️  OpenAI API key not found. Please set OPENAI_API_KEY environment variable."
  echo "   Get an API key from: https://platform.openai.com/api-keys"
  echo ""
  echo "Mission: Breaking poverty cycles through accessible education"
  echo "Target: Underserved communities in Nigeria/Africa"
  echo "Focus: Mobile-first, low-bandwidth, student data protection"
  exit 1
fi

if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install Node.js to use the AI assistant."
  exit 1
fi

# Create a temporary Node.js script for AI interaction
cat << 'EOF' > /tmp/pmerit-ai-assistant.js
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const question = process.argv[2];

(async () => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [{
        role: 'system',
        content: `You are an expert AI consultant for the PMERIT Educational Platform, focused on breaking poverty cycles through accessible education in Nigeria/Africa.

Key Context:
- Mission: Accessible, high-quality education for underserved communities
- Target Users: Students in Nigeria/Africa with limited resources
- Platform: AI-powered educational platform (Gabriel AI)
- Priorities: Mobile accessibility, low-bandwidth optimization, student data protection
- Technology: Modern web platform with responsive design

Provide specific, actionable technical advice that considers:
1. Mobile-first design for low-cost Android devices
2. Low-bandwidth optimization for areas with poor connectivity
3. Student privacy and data protection (GDPR/FERPA compliance)
4. Educational best practices for underserved communities
5. Practical implementation steps with realistic timelines

Be concise but comprehensive. Focus on solutions that directly impact educational outcomes.`
      }, {
        role: 'user',
        content: question
      }],
      max_tokens: 1200,
      temperature: 0.7
    });

    console.log('💡 PMERIT AI Educational Recommendation:\n');
    console.log(response.choices[0].message.content);
    console.log('\n🎓 Educational Impact: This guidance supports our mission of accessible education for all.');
  } catch (error) {
    console.error('❌ AI Assistant Error:', error.message);
    console.log('\n🎓 Educational Platform Support:');
    console.log('   • Check API key configuration');
    console.log('   • Verify internet connectivity');
    console.log('   • Contact: support@pmerit.com');
  }
})();
EOF

node /tmp/pmerit-ai-assistant.js "$QUESTION"
rm -f /tmp/pmerit-ai-assistant.js

echo ""
echo "🎓 PMERIT Educational Platform AI Assistant"
echo "   Empowering education through intelligent development"
