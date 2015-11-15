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
	console.log('U: ' + msg.author.username + ' S: ' + msg.content);
	if(msg.content[0] === '!') {
		var arguements = msg.content.split(" ");
		if( arguements[0] == '!ip' || arguements[0] == '!address'){
			//display server ip!
			bot.reply(msg, 'http://pvpcraft.ca');
		}
		
		if(arguements[0] == '!invite') {
			if(msg.content.indexOf('discord.gg') > -1 &&
			msg.channel instanceof Discord.PMChannel) {
				client.joinServer(msg.content.split(" ")[1], function(err, server) {
					if(err) {
						bot.reply(msg, 'Something went wrong, please contact admins');
					} else {
						bot.reply(msg, 'Successfully joined ' + msg.server.name);
					}
				});
			}
			bot.reply(msg, 'Please provide an invite link');
		}
	}
});

bot.login(AuthDetails.email, AuthDetails.password);
