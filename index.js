#!/usr/bin/env node
const { Client, Collection, Intents } = require('discord.js');
const { token } = require ('./token.json');
const fs = require('node:fs');
const path = require('node:path');

// new bot instance
const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });

bot.commands = new Collection();

const modulePath = path.join(__dirname, 'modules');
const moduleFiles = fs.readdirSync(modulePath).filter(file => file.endsWith('.js'));

for (const file of moduleFiles) {
	const filePath = path.join(modulePath, file);
	const module = require(filePath);
	bot.commands.set(module.data.name, module);
}

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`);
	console.log(`https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot%20applications.commands`);
	
});

bot.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = bot.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'An error occurred', ephemeral: true });
	}
});

bot.on("error", console.error);

bot.login(token);
