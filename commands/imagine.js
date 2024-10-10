const axios = require('axios');

module.exports = {
  name: 'Nics',
  description: 'Ask a question to GPT-4',
  author: 'Deku (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');

    // Validate input
    if (!prompt.trim()) {
      sendMessage(senderId, { text: 'Please enter a valid question.' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = 'https://deku-rest-apis.ooguy.com/gpt4';
      const response = await axios.post(apiUrl, { prompt: prompt, uid: `100${senderId}` });
      
      // Assuming the response returns an image URL
      const imageUrl = response.data.imageUrl; // Adjust this according to your API response format

      // Check if imageUrl is valid
      if (imageUrl) {
        sendMessage(senderId, { image_url: imageUrl }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'No image found for your query.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling GPT-4 API:', error);
      if (error.response) {
        sendMessage(senderId, { text: `Error: ${error.response.data.message}` }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'An unexpected error occurred. Please try again later.' }, pageAccessToken);
      }
    }
  }
};
