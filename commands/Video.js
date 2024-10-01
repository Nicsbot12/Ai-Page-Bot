const axios = require('axios');

module.exports = {
  name: 'video',
  description: 'Fetch song lyrics',
  author: 'Deku (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');
    try {
      const apiUrl = `https://deku-rest-api.gleeze.com/prn/home`;
      const response = await axios.get(apiUrl);
      const result = response.data.result;


        // Split the lyrics message into chunks if it exceeds 2000 characters
        const maxMessageLength = 2000;
        if (lyricsMessage.length > maxMessageLength) {
          const messages = splitMessageIntoChunks(lyricsMessage, maxMessageLength);
          for (const message of messages) {
            sendMessage(senderId, { text: message }, pageAccessToken);
          }
        } else {
          sendMessage(senderId, { text: lyricsMessage }, pageAccessToken);
        }

        // Optionally send an image if available
        if (result.video) {
          sendMessage(senderId, {
            attachment: {
              type: 'video',
              payload: {
                url: result.video,
                is_reusable: true
              }
            }
          }, pageAccessToken);
        }
      } else {
        console.error('Error: No lyrics found in the response.');
        sendMessage(senderId, { text: 'Sorry, no lyrics were found for your query.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Lyrics API:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
