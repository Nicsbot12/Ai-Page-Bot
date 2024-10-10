const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: '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' });

const messageHistory = new Map();

module.exports = {
  name: 'ai',
  description: 'Ai groq',
  author: 'Burat',

  async execute(senderId, messageText, pageAccessToken, sendMessage) {
    try {
      console.log("User Message:", messageText);

      // Send an initial message back to the user (empty text for now)
      sendMessage(senderId, { text: '' }, pageAccessToken);

      // Retrieve or initialize user history
      let userHistory = messageHistory.get(senderId) || [];
      if (userHistory.length === 0) {
        userHistory.push({ role: 'system', content: 'You are a helpful and kind assistant that answers everything.' });
      }
      userHistory.push({ role: 'user', content: messageText });

      // Call the Groq API
      const chatCompletion = await groq.chat.completions.create({
        messages: userHistory,
        model: 'llama3-8b-8192',
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: true,
        stop: null
      });

      // Collect and process the streamed response
      let responseMessage = '';
      for await (const chunk of chatCompletion) {
        if (chunk.choices && chunk.choices[0] && chunk.choices[0].delta) {
          responseMessage += chunk.choices[0].delta.content;
        } else {
          console.warn('Incomplete or missing choices in the response.');
        }
      }

      // Update user history
      userHistory.push({ role: 'assistant', content: responseMessage });
      messageHistory.set(senderId, userHistory);

      // Send the response back to the user
      sendMessage(senderId, { text: responseMessage }, pageAccessToken);

    } catch (error) {
      console.error('Error communicating with Groq:', error.stack);
      sendMessage(senderId, { text: "I'm busy right now, please try again later." }, pageAccessToken);
    }
  }
};
    
