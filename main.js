/*
 PvPCraft Friendly helper bot.
 */

var Discord = require("discord.js");

var AuthDetails = require("../auth.json");

var bot = new Discord.Client();

var colors = require('colors');

var request = require('request');

var now = require("performance-now");

var _ = require('underscore');

var Config = require("./lib/config");
var config = new Config("config");

var CleverBot = require('./lib/cleverbot');
var cleverBot = new CleverBot;

var ParseState = require('./lib/parseState');
var parseState = new ParseState;

var StateGrabber = require("./lib/worldState.js");
var worldState = new StateGrabber;

var comaUserName = '';
var comaUserNameCodes = '';

bot.on("ready", () => {
    console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
});

bot.on("disconnected", () => {
    console.error("Disconnected!");
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
                bot.sendMessage(welcomers[i], "Hop to it, " + user.username + " Just joined " + server.name + " announce it in <#77176186148499456>");
                bot.sendMessage(welcomers[i], "```Welcome **" + user.username + "**!```");
            }
        }
        setTimeout(function () {
            bot.sendMessage(server.defaultChannel, "Welcome **" + user.username + "** to the Warframe Discord! " +
                "Please check out <#83603071170510848> and <http://discord.info> for the rules, " +
                "and don't forget to have fun!")
        }, 15000);
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

bot.on("presence", (oldUser, newUser) => {
    if (newUser.game == oldUser.game) return;
    if (oldUser.status == "idle" || oldUser.status == "offline") return;
    if (newUser.game == null) return;
    var tracking = config.get("gameTrack");
    for (var track of tracking) {
        for (server of bot.servers) {
            if (track.server == server.id) {
                for (var user of server.members) {
                    if (user.id == newUser.id) {
                        for (role of server.rolesOfUser(newUser)) {
                            if (track.roles.indexOf(role.name) > -1) {
                                if (oldUser.game !== null) {
                                    console.log(colors.red(oldUser.game.name));
                                }
                                console.log(colors.blue(newUser.game.name));
                                bot.sendMessage(server.channels.getAll("id", track.announce)[0], "**" + newUser.username + "** is now playing **" + newUser.game.name + "**", (error) => {
                                    if (error) {
                                        console.log(error);
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    }
});

bot.on("message", (msg) => {
    if (msg.author.id == bot.user.id) return;
    if (msg.channel instanceof Discord.PMChannel) {
        //console.log();
        console.log(('PM:' + msg.author.username + ' S:' + msg.content).rainbow);
        if (msg.content.indexOf('help') > -1 || msg.content.indexOf('hi') > -1 || msg.content.indexOf('invite') > -1) {
            msg.reply("Hi, I'm a bot, you can invite me to your server using the OAuth2 url " +
                "https://discordapp.com/oauth2/authorize?&client_id=168133784078647296&scope=bot&permissions=66321471 " +
                "if you need to know a command simply type !!help")
        }
    }
    else {
        console.log('S:'.cyan + msg.channel.server.name + ' C:'.cyan + msg.channel.name +
            ' U:'.cyan + msg.author.username + ' S:'.cyan + msg.content);
    }

    if (msg.isMentioned(bot.user) && msg.content.toLowerCase().indexOf("help") > -1) {
        bot.reply(msg, '<@85257659694993408>, @whitehat97, ' + msg.author.username +
            ' needs help.\n'
            + 'type !!help for a list of commands');
    }

    else if (msg.content.toLowerCase().indexOf("how do i build a tardis") > -1 && msg.content[0] !== '!') {
        //display link to tardis site!
        bot.reply(msg, 'http\://eccentricdevotion.github.io/TARDIS/creating-a-tardis.html');
    }

    else if (msg.isMentioned(bot.user) && msg.content[0] !== '!') {
        //bot.sendTyping(msg.channel);
        console.log('Clever activating.');
        if (msg.content.toLowerCase().indexOf("best") > -1 &&
            msg.content.toLowerCase().indexOf("server") > -1) {
            bot.reply(msg, "Probably http://pvpcraft.ca.");
        } else {
            CleverBot.prepare(function () {
                console.log('Sent to Clever:' + msg.content.substr(msg.content.indexOf(' ') + 1));
                cleverBot.write(msg.content.substr(msg.content.indexOf(' ') + 1), function (response) {
                    bot.reply(msg, response.message.replace("Cleverbot", bot.user.username));
                });
            });
        }
    }

    //misc responses here
    if (!(msg.channel instanceof Discord.PMChannel)) {
        if (config.get("mscResponses").indexOf(msg.channel.server.id) > -1) {
            if (/^soon/i.test(msg.content) && msg.author.id != bot.id) {
                bot.sendMessage(msg.channel, 'Soon' + String.fromCharCode(8482));
                return true;
            }
        }
    }

    //check if user sent command
    if (msg.content.indexOf('!!') !== 0) return;

    //split command into sections based on spaces
    try {
        var args = msg.content.split(" ");
    } catch (err) {
        console.error(err);
        return;
    }
    //cach the command part of the string.
    var command;
    try {
        console.log((args[0]).toLowerCase());
        command = args[0].toLowerCase();
    } catch (err) {
        console.error(err);
        return;
    }

    if (command == '!!getchannelname') {
        msg.reply(bot.channels.get("id", args[1]).name);
    }

    //!help
    if (command == '!!help' || command == '!!commands' || command == '!!command') {
        //display server ip!
        bot.reply(msg, 'available commands:\n' +
            '```xl\n!!Help: get a list of commands\n' +
            '!!Creator: who made me?\n' +
            '!!Unflip: unflip flipped tables\n' +
            '!!Tardistutorial: get a link to the tardis tutorial\n' +
            '!!Youtube: get my master`s youtube\n' +
            '!!Anu \<mention\>: prints comma seporated list of username chars\n' +
            '!!Flarebuilds: links to flare_eyes warframe builds.\n' +
            '!!Totheforums: link to the forums\n' +
            '!!Wiki: finds something on the wiki\n' +
            '!!Farm: links a farming guide\n' +
            'Soon: display soon' + String.fromCharCode(8482) + "\n" +
            '!!Sortie: displays todays sorties\n' +
            '!!Darvo: displays daily deals\n' +
            '!!Trader: display the void traders gear\n' +
            '!!Updates: prints the current game version and link to changelog\n' +
            '!!Access: prints the current prime access and how long its been around\n```' +
            '!!Damage: gives a helpfull damage table'
        );
    }
    if (command == '!!kappa') {
        //display server ip!
        if (Math.random() > 0.5) {
            bot.sendFile(msg.channel, "../KappaRoss.jpg")
        }
        else {
            bot.sendFile(msg.channel, "../Kappa.png")
        }
    }
    if (command == "!!anu") {
        comaUserName = '';
        comaUserNameCodes = '';
        for (var x in msg.mentions[0].username) {
            comaUserName += msg.mentions[0].username[x] + ',';
            comaUserNameCodes += msg.mentions[0].username.charCodeAt(x) + ',';
            console.log('x: ' + x + 'ID:' + msg.mentions[0].username.charCodeAt(x) + ' Char:' + msg.mentions[0].username[x]);
        }
        bot.reply(msg, comaUserName);
        bot.reply(msg, comaUserNameCodes);
    }
    if (command == '!!creator') {
        //display author's name!
        bot.reply(msg, '```xl\nmy creator is Macdja38\n' +
            'with special sauce from Void_Glitch\n' +
            'using Discord.js by Hydrabolt\n```');
    }
    if (command == '!!youtube') {
        bot.reply(msg, '<https://www.youtube.com/user/macdja38>');
    }
    if (command == '!!flarebuilds') {
        bot.reply(msg, '<https://flareeyes.imgur.com/>');
    }
    if (command == '!!status') {
        bot.reply(msg, "<https://deathsnacks.com/wf/status.html/>");
    }
    if (command == '!!totheforums' || command == '!!forums') {
        //link to the forums!
        bot.reply(msg, 'The forums are probably a better place for this!\n' +
            'http://pvpcraft.ca/forums'
        );
    }
    if (args[0] == '!!tardistutorial'.toLowerCase() || command == '!!tardistut') {
        //display link to tardis site!
        bot.reply(msg, 'http://eccentricdevotion.github.io/TARDIS/creating-a-tardis.html');
    }

    //!ip or !address commands
    if (command == '!!ip' || command == '!!address') {
        //display server ip!
        bot.reply(msg, 'http://pvpcraft.ca');
    }

    //!unflip command
    if (command == '!!unflip') {
        bot.sendMessage(msg.channel, '┬─┬ ノ\( \^\_\^ノ\)');
    }

    /*
     //!ping
     else if(args[0] == '!ping') {
     if(msg.content.indexOf('.') > -1) {
     bot.reply(msg, ping(args[1] + " people online."))
     }
     else {
     bot.reply(msg, 'Please provide a valid url');
     }
     }
     */

    //get users id
    else if (command == '!!myid') {
        bot.reply(msg, 'Your Discord ID is ```' + msg.author.id + '```');
    }

    //get users roll
    else if (command == '!!roles') {
        if (msg.channel.server === undefined) {
            return;
        }
        for (var i in msg.mentions) {
            if (!msg.mentions.hasOwnProperty(i)) {
                continue;
            }
            var user = msg.mentions[i],
                roles = '',
                userRoles = msg.channel.server.rolesOf(user);
            for (var j in userRoles) {
                if (!userRoles.hasOwnProperty(j)) {
                    continue;
                }
                roles += userRoles[j].id + ',';
            }
            bot.reply(msg, '```' + user + ' has ' + roles + '```');
        }
    }

    else if (command == '!!serverinfo' || command == '!!server') {
        bot.reply(msg,
            "```xl\n" +
            "Name:" + msg.channel.server.name + "\n" +
            "Id:" + msg.channel.server.id + "\n" +
            "Owner:" + msg.channel.server.owner.name.replace(/`/g, String.fromCharCode(0) + "`") + "\n" +
            "Members:" + msg.channel.server.members.length + "\n" +
            "IconURL:\'" + msg.channel.server.iconURL + "\' \n" +
            "```"
        );
    }

    else if (command == '!!userinfo' || command == '!!user') {
        bot.reply(msg,
            "```fix\n" +
            "Name:" + msg.channel.server.name + "\n" +
            "id:" + msg.channel.server.id + "\n" +
            "owner:" + msg.channel.server.owner.name.replace(/`/g, String.fromCharCode(0) + "`") + "\n" +
            "members:" + msg.channel.server.members.length + "\n" +
            "iconURL:" + msg.channel.server.iconURL + "\n" +
            "```"
        );
    }
    /** Warframe commands past this point
     * Warframe Commands that access the worldstate api will be in the next section.
     */

    else if (command == '!!deals' || command == '!!darvo') {
        worldState.get(function (state) {
            bot.sendMessage(msg.channel, "```xl\n" + "Darvo is selling " +
                parseState.getName(state.DailyDeals[0].StoreItem) +
                " for " + state.DailyDeals[0].SalePrice +
                "p (" +
                state.DailyDeals[0].Discount + "% off, " + (state.DailyDeals[0].AmountTotal - state.DailyDeals[0].AmountSold) +
                "/" + state.DailyDeals[0].AmountTotal + " left, refreshing in " + secondsToTime(state.DailyDeals[0].Expiry.sec - state.Time) +
                ")" +
                "\n```");
        });
    }

    else if (command == '!!trader' || command == '!!voidtrader' || command == '!!baro') {
        worldState.get(function (state) {
            if (state.VoidTraders[0].Manifest) {
                var rep = "```xl\nBaro leaving " + state.VoidTraders[0].Node + " in " +
                    secondsToTime(state.VoidTraders[0].Expiry.sec - state.Time) + "\n";
                for (var item of state.VoidTraders[0].Manifest) {
                    rep += "item: " + parseState.getName(itemsg.ItemType) + " - price:" + itemsg.PrimePrice + " ducats " + itemsg.RegularPrice + "cr\n";
                }
                rep += "```"
                bot.sendMessage(msg.channel, rep);
            }
            else {
                bot.sendMessage(msg.channel, "```xl\nBaro appearing at " + state.VoidTraders[0].Node + " in " +
                    secondsToTime(state.VoidTraders[0].Activation.sec - state.Time) + "\n```");
            }
        });
    }

    else if (command == '!!trial' || command == '!!trials' || command == '!!raid' || command == '!!trialstats') {
        bot.sendMessage(msg.channel,
            "Hek: \<http://tinyurl.com/qb752oj\> Nightmare: \<http://tinyurl.com/p8og6xf\> Jordas: \<http://tinyurl.com/prpebzh\>");
    }

    else if (command == '!!wiki' && args.length > 1) {
        // check if page exists, kinda
        var url = 'https://warframe.wikia.com/wiki/';
        url += _.map(args.slice(1), function (n) {
            return n[0].toUpperCase() + n.substring(1);
        }).join('_');
        request.head(url, function (error, response) {
            if (error || response.statusCode !== 200) {
                bot.sendMessage(msg.channel, "could not find **" + args[1] + "**.");
                return;
            }
            bot.sendMessage(msg.channel, url);
        });
        return true;
    }

    else if (command == '!!sortie') {
        worldState.get(function (state) {
            var boss = parseState.getBoss(state.Sorties[0].Variants[0].bossIndex);
            var text = "```xl\n" + secondsToTime(state.Sorties[0].Expiry.sec - state.Time) + " left to defeat " +
                boss.name + " of the " + boss.faction + "\n";
            for (var Variant of state.Sorties[0].Variants) {
                var Region = parseState.getRegion(Variant.regionIndex);
                if (Region.missions[Variant.missionIndex] != "Assassination") {
                    text += Region.missions[Variant.missionIndex] + " on " + Region.name + " with " +
                        parseState.getModifiers(Variant.modifierIndex) + "\n";
                }
                else {
                    text += "Assassinate " + boss.name + " on " + Region.name + " with " +
                        parseState.getModifiers(Variant.modifierIndex) + "\n";
                }
            }
            text += "```";
            bot.sendMessage(msg.channel, text);
            return true;
        });
    }

    else if (command.indexOf('!!farm') == 0) {
        bot.sendMessage(msg.channel, "You can probably find that resource here: \<https://steamcommunity.com/sharedfiles/filedetails/?id=181630751\>");
        return true;
    }

    else if (command.indexOf('!!damage') == 0 || command.indexOf('!!elements') == 0) {
        bot.sendMessage(msg.channel, "```xl\nDamage 2.0: https://pvpcraft.ca/wfd2.png Thanks for image Telkhines\n```");
        return true;
    }

    else if (command === '!!primeaccess' || command === '!!access') {
        worldState.get(function (state) {
            var text = "```xl\n";
            for (var event of state.Events) {
                if (event.Messages[0].Message.toLowerCase().indexOf("access") > -1) {
                    text += event.Messages[0].Message.toUpperCase()
                        + " since " + secondsToTime(state.Time - event.Date.sec) + " ago\n";
                }
            }
            if (text != "```xl\n") {
                bot.sendMessage(msg.channel, text + "```")
            }
        });
    }

    else if (command === '!!update' || command === '!!updates') {
        worldState.get(function (state) {
            console.log(state.Events);
            var String = "```xl\n";
            var checks = ["update", "hotfix"];
            for (var event of state.Events) {
                for(var l of checks) {
                    if (event.Messages[0].Message.toLowerCase().indexOf(l) > -1) {
                        String += event.Messages[0].Message.toUpperCase() + " since " +
                            secondsToTime(state.Time - event.Date.sec) + " ago \n learn more here: " + event.Prop + "\n";
                        checks.slice(l);
                    }
                }
            }
            if(String !== "```xl\n") {
                bot.sendMessage(msg.channel, String + "```");
            }
        });
    }
    
    else if (command === '!!armorstats' || command === '!!armor') {
        (function() {
            console.log(args.length);
            console.log(args);
            if(args.length < 2 || args.length == 3 || args.length > 4) {
                bot.sendMessage(msg.channel, "```xl\npossible uses include:\n" +
                    "!!armor (Base Armor) (Base Level) (Current Level) calculate armor and stats.\n" +
                    "!!armor (Current Armor)\n```");
                return;
            }
            var text = "```xl\n";
            if(args.length == 4) {
                console.log(typeof(parseInt(args[1])));
                console.log(parseInt(args[1]));
                console.log(Math.pow((parseInt(args[3]) - parseInt(args[2])),1.75));
                if((parseInt(args[3]) - parseInt(args[2])) <= 0) {
                    bot.sendMessage(msg.channel, "```xl\nPlease check your input values\n```");
                    return;
                }
                var armor = parseInt(args[1]) * (1 + (Math.pow((parseInt(args[3]) - parseInt(args[2])),1.75) / 200));
                text += "at level " + args[3] + " your enemy would have " + armor + " Armor\n";
            }
            else{
                var armor = parseInt(args[1]);
            }
            text += armor / (armor + 300) * 100 + "% damage reduction\n";
            bot.sendMessage(msg.channel, text + "```");
        })();
    }
    
    
    
    
    
    

    /*
     locked commands past this point
     */
    if (AuthDetails.admins.indexOf(msg.author.id) < 0) return;
    console.log("Admin command:".red, msg.content);
    if (command == '!!setname') {
        if (args.length > 1) {
            bot.setUsername(args[1]);
            bot.reply(msg, 'Name set to ' + args[1]);
        }
        else {
            bot.reply(msg, 'Please enter a valid name');
        }
    }

    if (command == '!!eval') {
        var code = msg.content.slice(7);
        var t0 = now();
        try {
            var evaled = eval(code);
            var t1 = now();
            bot.sendMessage(msg.channel, "```xl\n" +
                clean(code) +
                "\n- - - - - - evaluates-to- - - - - - -\n" +
                clean(evaled) +
                "\n- - - - - - - - - - - - - - - - - - -\n" +
                "In " + (t1 - t0) + " milliseconds!\n```");
            console.log(evaled);
        }
        catch (error) {
            var t1 = now();
            bot.sendMessage(msg.channel, "```xl\n" +
                clean(code) +
                "\n- - - - - - - errors-in- - - - - - - \n" +
                clean(error) +
                "\n- - - - - - - - - - - - - - - - - - -\n" +
                "In " + (t1 - t0) + " milliseconds!\n```");
            console.error(error);
        }
    }

    //change the bot's current game
    if (command == '!!setgame') {
        if (args.length > 1) {
            bot.setStatus("online", args[1], function (err) {
                if (err) {
                    console.log(('error setting game to ' + args[1]).red);
                    console.error(err);
                } else {
                    console.log("Game set to " + args[1].green)
                }
            });
        }
        else {
            bot.reply(msg, 'Please enter a valid name');
        }
    }
    if (command == '!!newpromotedcall') {
        if (args.length > 1) {
            bot.createServer(String.fromCharCode(7) + args[1], "us-east");
        }
        else {
            bot.reply(msg, 'Please enter a valid name');
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

bot.loginWithToken(AuthDetails.token);

/*function repeatChar(count, ch) {
 var txt = "";
 for (var i = 0; i < count; i++) {
 txt += ch;
 }
 return txt;
 }
 */

function secondsToTime(secs) {
    secs = Math.round(secs);

    var days = Math.floor(secs / (60 * 60 * 24));

    var divisor_for_hours = secs % (24 * 60 * 60);
    var hours = Math.floor(divisor_for_hours / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
    if (days > 0) {
        return days + " Day" + s(days) + " and " + hours + " Hour" + s(hours);
    }
    else if (hours > 0) {
        return hours + " Hour" + s(hours) + " and " + minutes + " Minute" + s(minutes);
    }
    else if (minutes > 0) {
        return minutes + " Minute" + s(minutes) + " and " + seconds + " Second" + s(seconds);
    }
    else if (seconds) {
        return seconds + " Second" + s(seconds);
    }
}

function s(v) {
    return (v > 1) ? "s" : ""
}

function clean(text) {
    if (typeof(text) === "string") {
        return text.replace("``", "`" + String.fromCharCode(8203) + "`");
    }
    else {
        return text;
    }
}