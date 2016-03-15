/*
 PvPCraft Friendly helper bot.
 */

var Discord = require("discord.js");

var AuthDetails = require("../auth.json");

var bot = new Discord.Client();

var colors = require('colors');

var Config = require("./lib/config");
var config = new Config("config");

var CleverBot = require('./lib/cleverbot');
var cleverBot = new CleverBot;

var StateGrabber = require("./lib/worldState.js");
var worldState = new StateGrabber;

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
    console.log("Join-Event s:" + server.name + " u:" + user.name);
    if (config.get("announceJoin").indexOf(server.id) < 0) return;
    if (server.id == "77176186148499456") {
        var welcomers = server.usersWithRole("131303825448370177");
        for (var i in welcomers) {
            if (welcomers[i].status == "online") {
                console.log("We told " + welcomers[i].username + "to hop to it.");
                bot.sendMessage(welcomers[i], "Hop to it, " + user.username + " Just joined " + server.name);
                bot.sendMessage(welcomers[i], "```Welcome **" + user.username + "**!```");
            }
        }
        setTimeout(function () {
            bot.sendMessage(server.defaultChannel, "Please welcome **" + user.username + "**")
        }, 10000);
    }
    else if (server.id !== "110373943822540800" && server.id !== "88402934194257920") {
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
    if (newUser.username !== oldUser.username && newUser.id !== bot.user.id) {
        console.log("oldUser" + oldUser.username + " ID " + oldUser.id);
        console.log("newUser" + newUser.username + " ID " + newUser.id);
        for (var server in bot.servers) {
            for (var member in bot.servers[server].members) {
                if (oldUser.id == bot.servers[server].members[member].id &&
                    bot.servers[server].id !== "110373943822540800" &&
                    bot.servers[server].id !== "88402934194257920") {
                    bot.sendMessage(bot.servers[server].defaultChannel, newUser.username +
                        " Just changed their name to " + oldUser.username);
                }
            }
        }
    }
});

bot.on("message", (m) => {
    if (m.author.id == bot.user.id) return;
    if (m.channel instanceof Discord.PMChannel) {
        //console.log();
        console.log(('PM:' + m.author.username + ' S:' + m.content).rainbow);
    }
    else {
        console.log('S:'.cyan + m.channel.server.name + ' C:'.cyan + m.channel.name +
            ' U:'.cyan + m.author.username + ' S:'.cyan + m.content);
    }

    if (m.isMentioned(bot.user) && m.content.toLowerCase().indexOf("help") > -1) {
        bot.reply(m, '<@85257659694993408>, @whitehat97, ' + m.author.username +
            ' needs help.\n'
            + 'type !!help for a list of commands');
    }

    if (m.content.indexOf(":p") > -1) {
        if (m.channel.id !== "110373943822540800") {
            bot.reply(m, ':P');
        }
    }

    else if (m.content.toLowerCase().indexOf("how do i build a tardis") > -1 && m.content[0] !== '!') {
        //display link to tardis site!
        bot.reply(m, 'http\://eccentricdevotion.github.io/TARDIS/creating-a-tardis.html');
    }

    else if (m.isMentioned(bot.user) && m.content[0] !== '!') {
        //bot.sendTyping(m.channel);
        console.log('Clever activating.');
        if (m.content.toLowerCase().indexOf("best") > -1 &&
            m.content.toLowerCase().indexOf("server") > -1) {
            bot.reply(m, "Probably http://pvpcraft.ca.");
        } else {
            CleverBot.prepare(function () {
                console.log('Sent to Clever:' + m.content.substr(m.content.indexOf(' ') + 1));
                cleverBot.write(m.content.substr(m.content.indexOf(' ') + 1), function (response) {
                    bot.reply(m, response.message.replace("Cleverbot", bot.user.username));
                });
            });
        }
    }

    //check if user sent command
    if (m.content.indexOf('!!') !== 0) return;

    //split command into sections based on spaces
    var arguements = m.content.split(" ");
    //!help
    if (arguements[0].toLowerCase() == '!!help' || arguements[0].toLowerCase() == '!!address') {
        //display server ip!
        bot.reply(m, 'available commands:\n' +
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
    if (arguements[0].toLowerCase() == '!!kappa') {
        //display server ip!
        if (Math.random() > 0.5) {
            bot.sendFile(m.channel, "../KappaRoss.jpg")
        }
        else {
            bot.sendFile(m.channel, "../Kappa.png")
        }
    }
    if (arguements[0].toLowerCase() == "!!anu") {
        comaUserName = '';
        comaUserNameCodes = '';
        for (var x in m.mentions[0].username) {
            comaUserName += m.mentions[0].username[x] + ',';
            comaUserNameCodes += m.mentions[0].username.charCodeAt(x) + ',';
            console.log('x: ' + x + 'ID:' + m.mentions[0].username.charCodeAt(x) + ' Char:' + m.mentions[0].username[x]);
        }
        bot.reply(m, comaUserName);
        bot.reply(m, comaUserNameCodes);
    }
    if (arguements[0].toLowerCase() == '!!creator') {
        //display author's name!
        bot.reply(m, '```My creator is Macdja38\n' +
            'with warframe integration by tcooc\n' +
            'using Discord.js by hydrabolt```');
    }
    if (arguements[0].toLowerCase() == '!!youtube') {
        bot.reply(m, 'https://www.youtube.com/user/macdja38');
    }
    if (arguements[0].toLowerCase() == '!!flarebuilds') {
        bot.reply(m, '<https://flareeyes.imgur.com/>');
    }
    if (arguements[0].toLowerCase() == '!!status') {
        bot.reply(m, "<https://deathsnacks.com/wf/status.html/>");
    }
    if (arguements[0].toLowerCase() == '!!totheforums' || arguements[0].toLowerCase() == '!!forums') {
        //link to the forums!
        bot.reply(m, 'The forums are probably a better place for this!\n' +
            'http://pvpcraft.ca/forums'
        );
    }
    if (arguements[0] == '!!tardistutorial'.toLowerCase() || arguements[0].toLowerCase() == '!!tardistut') {
        //display link to tardis site!
        bot.reply(m, 'http://eccentricdevotion.github.io/TARDIS/creating-a-tardis.html');
    }

    //!ip or !address commands
    if (arguements[0].toLowerCase() == '!!ip' || arguements[0].toLowerCase() == '!!address') {
        //display server ip!
        bot.reply(m, 'http://pvpcraft.ca');
    }

    //!unflip command
    if (arguements[0].toLowerCase() == '!!unflip') {
        bot.sendMessage(m.channel, '┬─┬ ノ\( \^\_\^ノ\)');
    }

    //!invite command - broken
    else if (arguements[0].toLowerCase() == '!!invite') {
        if (m.content.indexOf('discord.gg') > -1) {
            if (m.channel instanceof Discord.PMChannel) {
                bot.joinServer(arguements[1], function (err, server) {
                    if (err) {
                        bot.reply(m, 'Something went wrong, please contact admins');
                    } else {
                        bot.reply(m, 'Successfully joined ' + server);
                    }
                });
            }
            else {
                bot.reply(m, 'Please *PM* me the invite');
            }
        }
        else {
            bot.reply(m, 'Please provide an invite link');
        }
    }

    /*
     //!ping
     else if(arguements[0] == '!ping') {
     if(m.content.indexOf('.') > -1) {
     bot.reply(m, ping(arguements[1] + " people online."))
     }
     else {
     bot.reply(m, 'Please provide a valid url');
     }
     }
     */

    //get users id
    else if (arguements[0].toLowerCase() == '!!myid') {
        bot.reply(m, 'Your Discord ID is ```' + m.author.id + '```');
    }

    //get users roll
    else if (arguements[0].toLowerCase() == '!!roles') {
        if (m.channel.server === undefined) {
            return;
        }
        for (var i in m.mentions) {
            if (!m.mentions.hasOwnProperty(i)) {
                continue;
            }
            var user = m.mentions[i],
                roles = '',
                userRoles = m.channel.server.rolesOf(user);
            for (var j in userRoles) {
                if (!userRoles.hasOwnProperty(j)) {
                    continue;
                }
                roles += userRoles[j].id + ',';
            }
            bot.reply(m, '```' + user + ' has ' + roles + '```');
        }
    }

    else if (arguements[0].toLowerCase() == '!!serverinfo') {
        bot.reply(m,
            "```fix\n" +
            "Name:" + m.channel.server.name + "\n" +
            "id:" + m.channel.server.id + "\n" +
            "owner:" + m.channel.server.owner.name.replace(/`/g, String.fromCharCode(0) + "`") + "\n" +
            "members:" + m.channel.server.members.length + "\n" +
            "iconURL:" + m.channel.server.iconURL + "\n" +
            "```"
        );
    }
    /** Warframe commands past this point
     * Warframe Commands that access the worldstate api will be in the next section.
     */

    else if (arguements[0].toLowerCase() == '!!deals' || arguements[0].toLowerCase() == '!!darvo') {
        console.log("T1".red);
        worldState.get(function (state) {
            bot.sendMessage(m.channel, "```ruby\n" + state.DailyDeals[0].StoreItem + "\n```");
        });
    }






    /*
     locked commands past this point
     */
    if (AuthDetails.admins.indexOf(m.author.id) < -1) return;
    console.log("Admin command:".red, m.content);
    if (arguements[0].toLowerCase() == '!!setname') {
        if (arguements.length > 1) {
            bot.setUsername(arguements[1]);
            bot.reply(m, 'Name set to ' + arguements[1]);
        }
        else {
            bot.reply(m, 'Please enter a valid name');
        }
    }

    //change the bot's current game
    if (arguements[0].toLowerCase() == '!!setgame') {
        if (arguements.length > 1) {
            bot.setStatus("online", arguements[1], function (err) {
                if (err) {
                    console.log(('error setting game to ' + arguements[1]).red);
                    console.error(err);
                } else {
                    console.log("Game set to " + arguements[1].green)
                }
            });
        }
        else {
            bot.reply(m, 'Please enter a valid name');
        }
    }
    if (arguements[0].toLowerCase() == '!!newpromotedcall') {
        if (arguements.length > 1) {
            bot.createServer(String.fromCharCode(7) + arguements[1], "us-east");
        }
        else {
            bot.reply(m, 'Please enter a valid name');
        }
    }
});

function error(e) {
    console.error("FAILED DURING TEST");
    console.error(e.stack);
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

/*function repeatChar(count, ch) {
 var txt = "";
 for (var i = 0; i < count; i++) {
 txt += ch;
 }
 return txt;
 }
 */