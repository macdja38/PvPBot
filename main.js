/*
	PvPCraft Friendly helper bot.
*/

var Discord = require("discord.js");

var AuthDetails = require("../auth.json");

var bot = new Discord.Client();

var Cleverbot = require('./lib/cleverbot');
    cleverbot = new Cleverbot;
    
var comaUserName = '';
var comaUserNameCodes = '';

bot.on("ready", () => {
	console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
});

bot.on("disconnected", () => {

	console.log("Disconnected!");
	process.exit(1); //exit node.js with an error
	
});

bot.on("serverNewMember", (server, user) => {
	if(server.id == 77176186148499456) {
		bot.sendMessage(server.members.get("id", "117326514726371335"), "Hop to it, " + user.username + " Just joined " + server.name);
		bot.sendMessage(server.members.get("id", "117326514726371335"), "```Welcome **" + user.username + "**!```");
		setTimeout(function(){bot.sendMessage(server.defaultChannel, "Please welcome **" + user.username + "**")},10000);
	}
	else if(server.id !== "110373943822540800" && server.id !== "88402934194257920") {
		bot.sendMessage(server.defaultChannel, "Please welcome **" + user.username + "**");
	}
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
	if(newUser.username !== oldUser.username && newUser.id !== bot.user.id) {
		console.log("oldUser" + oldUser.username + " ID " + oldUser.id);
		console.log("newUser" + newUser.username + " ID " + newUser.id);
		for (server in bot.servers) {
			for (member in bot.servers[server].members) {
				if(oldUser.id == bot.servers[server].members[member].id &&
					bot.servers[server].id !== "110373943822540800" && 
					bot.servers[server].id !== "88402934194257920"){
					bot.sendMessage(bot.servers[server].defaultChannel, newUser.username + 
						" Just changed their name to " + oldUser.username);
				}
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
		
		if(msg.isMentioned(bot.user) && msg.content.toLowerCase().indexOf("help") > -1) {
			bot.reply(msg, '<@85257659694993408>, @whitehat97, ' + msg.author.username + 
				' needs help.\n'
				+ 'type !!help for a list of commands');
		}
		/*
		if(msg.content.indexOf("Rick Astley - Never Gonna Give You Up") > -1) {
			bot.sendMessage(msg.channel, "@QmusicBot n");
		}
		*/
		if(msg.content.indexOf(":p") > -1) {
			if(msg.channel.id !== "110373943822540800") {
				bot.reply(msg, ':P');
			}
		}
		
		else if(msg.content.toLowerCase().indexOf("how do i build a tardis") > -1 && msg.content[0] !== '!'){
			//display link to tardis site!
			bot.reply(msg, 'http\://eccentricdevotion.github.io/TARDIS/creating-a-tardis.html');
		}
		
		else if(msg.isMentioned(bot.user) && msg.content[0] !== '!') {
			//bot.sendTyping(msg.channel);
			console.log('Clever activating.');
			if(msg.content.toLowerCase().indexOf("best")>-1 &&
				msg.content.toLowerCase().indexOf("server")>-1) {
				bot.reply(msg, "Probably http://pvpcraft.ca.");
			} else {
				Cleverbot.prepare(function(){
					console.log('Sent to Clever:' + msg.content.substr(msg.content.indexOf(' ')+1));
					cleverbot.write(msg.content.substr(msg.content.indexOf(' ')+1), function (response) {
						bot.reply(msg, response.message.replace("Cleverbot", bot.user.username));
					});
				});
			}
		}
		
		//check if user sent command
		if(msg.content.indexOf('!!') > -1 && msg.content.indexOf('!!') < 2) {
			
			//split command into sections based on spaces
			var arguements = msg.content.split(" ");
			
			//!help
			if( arguements[0].toLowerCase() == '!!help' || arguements[0].toLowerCase() == '!!address'){
				//display server ip!
				bot.reply(msg, 'available commands:\n' +
				'```!!help: get a list of commands\n' +
				'!!creator: who made me?\n' +
				'!!unflip: unflip flipped tables\n' +
				'!!tardistutorial: get a link to the tardis tutorial\n' +
				'!!youtube: get my master\'s youtube\n' +
				'!!anu: prints comma seporated list of username chars\n' +
				'!!flarebuilds: links to flare_eyes warframe builds.\n' +
				'!!totheforums: link to the forums```'
				);
			}
			
			if( arguements[0].toLowerCase() == '!!kappa'){
				//display server ip!
				if (Math.random() > 0.5) {
					bot.sendFile(msg.channel, "../KappaRoss.jpg")
				}
				else 
				{
					bot.sendFile(msg.channel, "../Kappa.png")
				}
			}
			
			if(arguements[0].toLowerCase() == "!!anu") {
				comaUserName = '';
				comaUserNameCodes = '';
				for (x in msg.mentions[0].username) {
					comaUserName += msg.mentions[0].username[x] + ',';
					comaUserNameCodes += msg.mentions[0].username.charCodeAt(x) + ',';
					console.log('x: ' + x + 'ID:' + msg.mentions[0].username.charCodeAt(x) + ' Char:' + msg.mentions[0].username[x]);
				}
				bot.reply(msg, comaUserName);
				bot.reply(msg, comaUserNameCodes);
			}
					
			if( arguements[0].toLowerCase() == '!!creator'){
				//display author's name!
				bot.reply(msg, '```My creator is Macdja38\n' + 
						'with warframe integration by tcooc\n' +
						'using Discord.js by hydrabolt```');	
			}
			
			if( arguements[0].toLowerCase() ==  '!!youtube') {
				bot.reply(msg, 'https://www.youtube.com/user/macdja38');
			}
			
			if( arguements[0].toLowerCase() ==  '!!flarebuilds') {
				bot.reply(msg, '<https://flareeyes.imgur.com/>');
			}
			
			if( arguements[0].toLowerCase() ==  '!!status') {
				bot.reply(msg, '<https://deathsnacks.com/wf/status.html/>');
			}
			
			if( arguements[0].toLowerCase() == '!!totheforums' || arguements[0].toLowerCase() == '!!forums'){
				//link to the forums!
				bot.reply(msg, 'The forums are probably a better place for this!\n' +
						'http://pvpcraft.ca/forums'	
				);	
			}
			
			if( arguements[0] == '!!tardistutorial'.toLowerCase() || arguements[0].toLowerCase() == '!!tardistut'){
				//display link to tardis site!
				bot.reply(msg, 'http://eccentricdevotion.github.io/TARDIS/creating-a-tardis.html');
			}
			
			//!ip or !address commands
			if( arguements[0].toLowerCase() == '!!ip' || arguements[0].toLowerCase() == '!!address'){
				//display server ip!
				bot.reply(msg, 'http://pvpcraft.ca');
			}
			
			//!unflip command
			if( arguements[0].toLowerCase() == '!!unflip') {
		        	bot.sendMessage(msg.channel, '\┬\─\┬ \ノ\( \^\_\^\ノ\)');
			}
			
			//!invite command - broken
			else if(arguements[0].toLowerCase() == '!!invite') {
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
			else if(arguements[0].toLowerCase() == '!!myid') {
					bot.reply(msg, 'Your Discord ID is ```' + msg.author.id + '```');
			}
			
			//get users roll
			else if(arguements[0].toLowerCase() == '!!roles') {
				var i = 0;
				var j = 0;
				for (i in msg.mentions) {
					var user = msg.mentions[i];
					var roles = '';
					for (j in msg.channel.server.rolesOf(user)) {
						roles += msg.channel.server.rolesOf(user)[j].id + ',';
					}
					bot.reply(msg, '```' + user + ' has ' + roles + '```');
				}
			}
			
			/*
				locked commands past this point
			*/
			else if(AuthDetails.admins.indexOf(msg.author.id)>-1) {
				if(arguements[0].toLowerCase() == '!!setname') {
					if(arguements.length > 1) {
						bot.setUsername(arguements[1]);
						bot.reply(msg, 'Name set to ' + arguements[1]);
						
					}
					else {
						bot.reply(msg, 'Please enter a valid name');
					}
				}
				
				//change the bot's current game
				if(arguements[0].toLowerCase() == '!!setgame') {
					if(arguements.length > 1) {
						bot.setStatus("online", arguements[1], function(err){
							if(err) {
								console.log('error setting game to ' + arguements[1])
								console.log(err);
							} else {
								console.log("Game set to " + arguements[1])
							}
						});
					}
					else {
						bot.reply(msg, 'Please enter a valid name');
					}
				}
				
				if(arguements[0].toLowerCase() == '!!newpromotedcall') {
					if(arguements.length > 1) {
						bot.createServer(String.fromCharCode(0007) + arguements[1], "us-east");
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

function repeatChar(count, ch) {
    var txt = "";
    for (var i = 0; i < count; i++) {
        txt += ch;
    }
    return txt;
}
