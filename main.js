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
	console.log('U: ' + msg.author.username + ' S: ' + msg.content + ' P0 ' + msg.content[0] + ' P1 ' + msg.content[1]);
		
	if(msg.content[0] === '!') {
		console.log(msg.content);
		if( msg.content.indexOf("ip") === 1 || msg.content.indexOf("address") === 1){
			//display server ip.
			bot.reply( '@' + msg.author.username, ", http://pvpcraft.ca" );
		}
	
		if(msg.content.indexOf("invite") === 1 &&
			msg.content.indexOf('discord.gg') > -1 &&
			msg.channel instanceof Discord.PMChannel) {
			client.joinServer(msg.content[1], function(err, server) {
				if(err) {
					bot.reply(msg, 'Something went wrong, please contact admins');
				} else {
					bot.reply(msg, 'Successfully joined ' + msg.server.name);
				}
			});
		}
	}
});

bot.login(AuthDetails.email, AuthDetails.password);
