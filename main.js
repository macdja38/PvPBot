/*
	PvPCraft Friendly helper bot.
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
		
		else if(arguements[0] == '!invite') {
			if(msg.content.indexOf('discord.gg') > -1) {
				if(msg.channel instanceof Discord.PMChannel) {
					bot.joinServer(msg.content.split(" ")[1], function(err, server) {
						if(err) {
							bot.reply(msg, 'Something went wrong, please contact admins');
						} else {
							bot.reply(msg, 'Successfully joined ' + server);
						}
					});
				}
				else {
					bot.reply(msg, 'Please *PM* me the invite');
				}
			}
			else {
				bot.reply(msg, 'Please provide an invite link');
			}
		}
		
		else if(arguements[0] == '!myid') {
			if(msg.channel instanceof Discord.PMChannel) {
				bot.reply(msg, 'Please PM this command');
			}
			else {
				bot.reply(msg, 'Your Discord ID is ' + msg.author.id);
			}
		}
		
		/*
			locked commands past this point
		*/
		else if(msg.author.id == AuthDetails.adminid || msg.author.id == AuthDetails.adminid2 || msg.author.id == AuthDetails.adminid3) {
			if(arguements[0] == '!setname') {
				if(arguements.length > 1) {
					bot.setUsername(arguements[1], callback);
				}
				else {
					bot.reply(msg, 'Please enter a valid name');
				}
			}		
		}
	}
});

bot.login(AuthDetails.email, AuthDetails.password);
