/*
	PvPCraft Friendly helper bot.
*/

var Discord = require("/Discord-Api/discord.js");

var AuthDetails = require("/auth.json");

var bot = new Discord.Client();

var Cleverbot = require('/Discord-Bot/PvPBot-master/lib/cleverbot');
    cleverbot = new Cleverbot;

bot.on("ready", () => {
	console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
});

bot.on("disconnected", () => {

	console.log("Disconnected!");
	process.exit(1); //exit node.js with an error
	
});

bot.on("serverNewMember", (user, server) => {
	bot.sendMessage(server.defaultChannel, "Please welcome " + user.username);
});

/*bot.on("userUpdate", (newUser, OldUser) => {
	for (server in bot.servers) {
		if(server.getMember("id", newUser.id) !== undefined){
			bot.sendMessage(server.defaultChannel, oldUser.username + 
				" Just changed their name to " + newUser.username);
		}
	}
});*/

bot.on("userUpdate", (newUser, oldUser) => {
	console.log("oldUser" + oldUser.username + " ID " + oldUser.id);
	console.log("newUser" + newUser.username + " ID " + newUser.id);
	for (server in bot.servers) {
		console.log("Servers:" + server.members);
		for (member in server.members) {
			console.log("Member:" + member.id);
			if(oldUser.equals(member)){
				bot.sendMessage(server.defaultChannel, oldUser.username + 
					" Just changed their name to " + newUser.username);
			}
		}
	}
});

bot.on("message", (msg) => {
	if(msg.author.id !== bot.user.id) {
		if(msg.channel instanceof Discord.PMChannel) {
			console.log('PM:' + msg.author.username + ' S:' + msg.content);
		}
		else
		{
			console.log('S:' + msg.channel.server.name + ' C:' + msg.channel.name + 
					' U:' + msg.author.username + ' S:' + msg.content);
		}
		
		if(msg.content.toLowerCase().indexOf("help") > -1 && msg.content[0] == '@') {
			bot.reply(msg, '@macdja38, @whitehat97, @londamatt, ' + msg.author.username + 
				' needs help.\n' + 'type !help for a list of commands');
		}
		
		else if(msg.content.toLowerCase().indexOf("how do i build a tardis") > -1 && msg.content[0] !== '!'){
			//display link to tardis site!
			bot.reply(msg, 'http\://eccentricdevotion.github.io/TARDIS/creating-a-tardis.html');
		}
		
		else if(msg.isMentioned(bot.user) && msg.content[0] !== '!') {
			console.log('Clever activating.');
			if(msg.content.toLowerCase().indexOf("best")>-1 &&
				msg.content.toLowerCase().indexOf("server")>-1) {
				bot.reply(msg, "Probably http://pvpcraft.ca.");
			} else {
				Cleverbot.prepare(function(){
					cleverbot.write(msg.content.substr(msg.content.indexOf(' ')+1), function (response) {
						bot.reply(msg, response.message.replace("Cleverbot", bot.user.username));
					});
				});
			}
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
				'unflip: unflip flipped tables\n' +
				'tardistutorial: get a link to the tardis tutorial\n' +
				'totheforums: link to the forums'
				);
			}
					
			if( arguements[0] == '!whosyourdaddy' || arguements[0] == '!creator'){
				//display author's name!
				bot.reply(msg, 'My creator is Macdja38');	
			}
			
			if( arguements[0].toLowerCase() ==  '!youtube') {
				bot.reply(msg, 'https://www.youtube.com/user/macdja38');
			}
			
			if( arguements[0] == '!totheforums' || arguements[0] == '!forums'){
				//link to the forums!
				bot.reply(msg, 'The forums are probably a better place for this!\n' +
						'http://pvpcraft.ca/forums'	
				);	
			}
			
			if( arguements[0] == '!tardistutorial' || arguements[0] == '!tardistut'){
				//display link to tardis site!
				bot.reply(msg, 'http://eccentricdevotion.github.io/TARDIS/creating-a-tardis.html');
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
						bot.joinServer(arguements[1], function(err, server) {
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
			
			/*
			//!ping
			else if(arguements[0] == '!ping') {
				if(msg.content.indexOf('.') > -1) {
					bot.reply(msg, ping(arguements[1] + " people online."))
				}
				else {
					bot.reply(msg, 'Please provide a valid url');
				}
			}
			*/
			
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
				if(arguements[0] == '!setgame') {
					if(arguements.length > 1) {
						bot.setPlayingGame(arguements[1]);
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

/*function ping(link) {
    $.getJSON(link, function(json){
        if(json.Players !== undefined) {
            return json.Players;
        } else {
            return 0;
        }
    });
}*/

bot.login(AuthDetails.email, AuthDetails.password);
