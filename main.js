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
	if(msg.author.id !== bot.user.id) {
		console.log('U: ' + msg.author.username + ' S: ' + msg.content);
		
		if(msg.content.indexOf("help") > -1 && msg.content[0] !== '!') {
			bot.reply(msg, '@macdja38, @whitehat97, @londamatt, ' + msg.author.username + ' needs help.\n' +
			'type !help for a list of commands');
		}
		
		//check if user sent command
		if(msg.content[0] === '!') {
			
			//split command into sections based on spaces
			var arguements = msg.content.split(" ");
			
			//!help
			if( arguements[0] == '!help' || arguements[0] == '!address'){
				//display server ip!
				bot.reply(msg, 'available commands:\n' +
				'help: get a list of commands\n' +
				'unflip: unflip flipped tables'
				);
			}
			
			//!ip or !address commands
			if( arguements[0] == '!ip' || arguements[0] == '!address'){
				//display server ip!
				bot.reply(msg, 'http://pvpcraft.ca');
			}
			
			//!unflip command
			if( arguements[0] == '!unflip') {
		        	bot.sendMessage(msg.channel, '\┬\─\┬ \ノ\( \^\_\^\ノ\)');
			}
			
			//!invite command - broken
			else if(arguements[0] == '!invite') {
				if(msg.content.indexOf('discord.gg') > -1) {
					if(msg.channel instanceof Discord.PMChannel) {
						//bot.joinServer(msg.content.split(" ")[1], function(err, server) {
						bot.joinServer(arguements[1]).then(nothing).catch(error);
							/*if(err) {
								bot.reply(msg, 'Something went wrong, please contact admins');
							} else {
								bot.reply(msg, 'Successfully joined ' + server);
							}
						});*/
					}
					else {
						bot.reply(msg, 'Please *PM* me the invite');
					}
				}
				else {
					bot.reply(msg, 'Please provide an invite link');
				}
			}
			
			//get users id
			else if(arguements[0] == '!myid') {
				if(msg.channel instanceof Discord.PMChannel) {
					bot.reply(msg, 'Your Discord ID is ' + msg.author.id);
				}
				else {
					bot.reply(msg, 'Please PM this command');
				}
			}
			
			/*
				locked commands past this point
			*/
			else if(msg.author.id == AuthDetails.adminid || msg.author.id == AuthDetails.adminid2 || msg.author.id == AuthDetails.adminid3) {
				if(arguements[0] == '!setname') {
					if(arguements.length > 1) {
						bot.setUsername(arguements[1]);
						bot.reply(msg, 'Name set to ' + arguements[1]);
					}
					else {
						bot.reply(msg, 'Please enter a valid name');
					}
				}
				
				//TODO: change bot's rank's color
				if(arguements[0] == '!setcolor') {
					if(arguements.length > 1) {
						bot.setUsername(arguements[1]);
					}
					else {
						bot.reply(msg, 'Please enter a valid name');
					}
				}
			}
		}
	}
});

function error(e) {
	console.log("FAILED DURING TEST");
	console.log(e.stack);
	process.exit(1);
}

function nothing() {
	console.log("nothing");
}

bot.login(AuthDetails.email, AuthDetails.password);
