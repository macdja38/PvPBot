/*
	this bot is an avatar bot, and will give a user their avatar's URL
*/

var Discord = require("/Discord-Api/discord.js");

var AuthDetails = require("/auth.json");

var bot = new Discord.Client();

bot.on("ready", () => {
	console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
});

bot.on("disconnected", () => {

	console.log("Disconnected!");
	process.exit(1); //exit node.js with an error
	
});

bot.on("message", (msg) => {
	
	if( msg.content === "avatar" ){
		// if the message was avatar
		bot.reply( msg, msg.sender.avatarURL );
	}
	
	if(msg.content[0] === '!invite' &&
		msg.content[1].indexOf('discord.gg') > -1 &&
		msg.channel instanceof Discord.PMChannel) {
		client.joinServer(msg.content[1], function(err, server) {
			if(err) {
				client.sendMessage(msg.channel, 'Something went wrong, please contact admins');
			} else {
				client.sendMessage(message.channel, 'Successfully joined ' + msg.server.name);
			}
		});
	}
	
});

bot.login(AuthDetails.email, AuthDetails.password);
