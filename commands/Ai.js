import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env['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'], // This is the default and can be omitted
});


const messageHistory = new Map();

module.exports = {
  name: 'ai',
  description: 'Ai groq',
  author: 'Burat',

  async execute(senderId, messageText, pageAccessToken, sendMessage) {
    try {
      
      console.log("User Message:", messageText);

      
      sendMessage(senderId, { text: '' }, pageAccessToken);

      
      let userHistory = messageHistory.get(senderId) || [];
      if (userHistory.length === 0) {
        userHistory.push({ role: 'system', content: 'You are a helpful and kind assistant that answers everything.' });
      }
      userHistory.push({ role: 'user', content: messageText });

      
      const response = await client.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-4o-mini'
});

      
      let responseMessage = '';
      for await (const chunk of chatCompletion) {
        responseMessage += (chunk.choices[0] && chunk.choices[0].delta && chunk.choices[0].delta.content) || '';
      }

      
      userHistory.push({ role: 'assistant', content: responseMessage });

      
      messageHistory.set(senderId, userHistory);

      
      sendMessage(senderId, { text: responseMessage }, pageAccessToken);

    } catch (error) {
      console.error('Error communicating with Groq:', error.message);
      sendMessage(senderId, { text: "I'm busy right now, please try again later." }, pageAccessToken);
    }
  }
};
