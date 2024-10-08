const prefix = ('/');
const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./sendMessage');
const commands = new Map();

// Load all command modules dynamically
const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  commands.set(command.name, command);
  console.log(`Loaded command: ${command.name}`);
}

async function handleMessage(event, pageAccessToken) {
  const senderId = event.sender.id;
  const messageText = event.message.text.toLowerCase();

  if (!messageText.startsWith(prefix)) return;

  const args = messageText.slice(prefix.length).split(' ');  // Remove prefix
  const commandName = args.shift();

  console.log(`Received command: ${commandName} with args: ${args}`);

  if (commands.has(commandName)) {
    const command = commands.get(commandName);
    try {
      await command.execute(senderId, args, pageAccessToken, sendMessage);
      console.log(`Executed command: ${commandName}`);
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      sendMessage(senderId, { text: 'There was an error executing that command.' }, pageAccessToken);
    }
  } else {
    console.log(`Command not found: ${commandName}`);
  }
}

module.exports = { handleMessage };
