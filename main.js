const Discord = require('discord.js');
const client = new Discord.Client();

const google = require('googleapis').google;
const youtube = google.youtube('v3');

const prefix = 'z/';
const fs = require('fs');

require('dotenv').config();

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

// Initialize
client.once('ready', () => {
    console.log('ZodBot is online!');

    client.channels.fetch('814163942208307220').then(channel => {
        const roleMessages = JSON.parse(fs.readFileSync('./resources/role-messages.json'));

        Object.keys(roleMessages).forEach(id => {
            channel.messages.fetch(id).catch(err => console.log);
        });
    });

    client.user.setActivity("z/help", {
        type: "LISTENING"
    });
});

// Welcome new members in the "📢welcome📢" text channel
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === '📢welcome📢');
    if (!channel) {
        console.log("Could not find the 📢welcome📢 channel");
        return;
    }
    member.roles.add(getRole('gröt'));

    const mutedUsers = JSON.parse(fs.readFileSync('./resources/muted-users.json'));

    if (Object.keys(mutedUsers).includes(member.id)) {
        member.roles.add(getRole('Muted'));
        channel.send(`Hello ${member}. You cannot escape your mute by leaving the server.`).then(msg => {
            msg.react('🤡');
        });
        return;
    }

    channel.send(`Hello ${member}! Welcome to ${member.guild.name}!`);
});

client.on("presenceUpdate", (oldPresence, newPresence) => {
    if (newPresence.activities.length < 1) {
        client.user.setActivity("z/help", {
            type: "LISTENING"
        });
        return false;
    }

    if (!oldPresence || oldPresence.activities.some(a => a.type === "STREAMING")) return;

    if (newPresence.userID === '265586367147278337') {
        if (newPresence.activities.some(a => a.type === "STREAMING")) {
            newPresence.member.guild.channels.cache
                .find(ch => ch.name === '📢feed📢')
                .send(`${getRole('Twitch Announcements')} ZodiSP is now streaming at ${newPresence.activities[0].url} !`)
                .then(message => {
                    message.react(getEmoji('ZodChair'));
                    message.react(getEmoji('PEPEHappy'));
                });
            return true;
        }
    }
});

client.on('message', message => {
    if (message.content.match(/^(:[^:\s]+:|<:[^:\s]+:[0-9]+>|<a:[^:\s]+:[0-9]+>)+$/)) {
        message.react(getEmoji('ZodChair'));
    }
    if (message.channel.type === 'dm') {
        fs.writeFileSync('./resources/DM-log.txt', `${message.author.username}: ${message.content}`);
    }

    if (message.author.bot) return;
    if (message.channel.type === 'dm') return message.channel.send("You cannot use commands in DMs.");
    hasProfanity(message).then(isSwear => {
        if (isSwear) {
            message.channel.send(`${message.author} Please try to keep chat PG.`);
        }
    });

    if (!message.content.startsWith(prefix) || message.content.startsWith('<@!817447645161062411>')) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'help':
            client.commands.get('help').execute(message, args);
            break;
        case 'ping':
            message.channel.send('pong!');
            break;
        case 'pb':
            client.commands.get('pb').execute(message, args);
            break;
        case 'clear':
            client.commands.get('clear').execute(message, args);
            break;
        case 'msg':
        case 'message':
            client.commands.get('message').execute(message, args);
            break;
        case 'mute':
            client.commands.get('mute').execute(message, args);
            break;
        case 'rolemessage':
        case 'rolemsg':
            client.commands.get('rolemsg').execute(message, args);
            break;
        case 'warn':
            client.commands.get('warn').execute(message, args);
            break;
        case 'youtube':
        case 'yt':
            client.commands.get('youtube').execute(message, args);
            break;
        case 'video':
            client.commands.get('video').execute(message, args);
            break;
        case 'command':

            break;
        case 'clog':
            client.commands.get('log').execute(message, args);
            break;
    }
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    if (oldMessage.author.bot) return;
    hasProfanity(newMessage).then(isSwear => {
        if (isSwear) {
            newMessage.channel.send(`${newMessage.author} Please try to keep chat PG.`);
        }
    });
});

client.on('messageDelete', message => {
    var roleMessages = JSON.parse(fs.readFileSync('./resources/role-messages.json'));

    if (Object.keys(roleMessages).includes(message.id)) {
        delete roleMessages[message.id];
        fs.writeFileSync('./resources/role-messages.json', JSON.stringify(roleMessages, null, '\t'));
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    if (user.bot) return;

    const roleMessages = JSON.parse(fs.readFileSync('./resources/role-messages.json'));
    Object.keys(roleMessages).forEach(msgID => {


        if (reaction.message.id === msgID) {
            const member = client.guilds.cache.find(g => g.name === 'ZodGod').member(user);
            const role = roleMessages[msgID][reaction.emoji];
            member.roles.add(getRoleById(role));
        }
    });
});

client.on('messageReactionRemove', (reaction, user) => {
    if (user.bot) return;
    const roleMessages = JSON.parse(fs.readFileSync('./resources/role-messages.json'));

    Object.keys(roleMessages).forEach(msgID => {
        if (reaction.message.id === msgID) {
            const member = client.guilds.cache.find(g => g.name === 'ZodGod').member(user);
            const role = roleMessages[msgID][reaction.emoji];
            member.roles.remove(getRoleById(role));
        }
    });
});

async function hasProfanity(message) {
    const blacklist = fs.readFileSync('./resources/data-collection-blacklist.txt', 'utf-8').split('\n');
    if (blacklist !== undefined) {
        const implicit_profanity = fs.readFileSync('./resources/implicit-profanity.txt', 'utf-8').split('\n');
        const explicit_profanity = fs.readFileSync('./resources/explicit-profanity.txt', 'utf-8').split('\n');

        var isSwear = false;
        implicit_profanity.forEach(swear => {
            swear = swear.trim().toLowerCase();
            if (message.content.includes(swear)) isSwear = true;
        });

        const words = message.content.split(/ +/);
        explicit_profanity.forEach(swear => {
            if (words.includes(swear.trim())) isSwear = true;
        });

        if (isSwear) {
            if (!blacklist.some(id => id.trim() === message.author.id)) {
                fs.appendFileSync('./resources/profanity-data.txt', message.content + '\n');
            }

            message.react('🤬');
            client.commands.get('warn').execute(message, [`<@!${message.member.user.id}>`, "profanity"]);
        }
    } else {
        console.log("blacklist is undefined");
    }
}

function getRole(roleName) {
    const roles = client.guilds.cache.find(g => g.name === 'ZodGod').roles.cache;
    const role = roles.find(r => r.name === roleName);

    return role;
}

function getRoleById(roleID) {
    const roles = client.guilds.cache.find(g => g.name === 'ZodGod').roles.cache;
    const role = roles.get(roleID);

    return role;
}

function getMember(memberID) {
    const members = client.guilds.cache.find(g => g.name === 'ZodGod').members.cache;
    const member = members.get(memberID);

    return member;
}

function getEmoji(emojiName) {
    const emojis = client.guilds.cache.find(g => g.name === 'ZodGod').emojis.cache;
    const emoji = emojis.find(e => e.name === emojiName);

    return emoji;
}

async function checkNewUploads() {
    youtube.activities.list({
        key: process.env.YOUTUBE_TOKEN,
        part: 'contentDetails',
        channelId: 'UCBb4eNzHMUpFnNWskn0mTOg',
        maxResults: 1
    }).then(response => {
        const video = response.data.items[0].contentDetails.upload.videoId;

        if (video != fs.readFileSync('./resources/last-upload.txt', 'utf-8')) {
            const zodgod = client.guilds.cache.find(g => g.name === 'ZodGod');
            const channel = zodgod.channels.cache.find(ch => ch.name === '📢feed📢');

            console.log("New upload on Zodi's channel!");
            channel.send(`${getRole('Youtube Announcements')} Zodi just uploaded a new video, check it out! https://youtube.com/watch?v=${video}`)
                .then(msg => {
                    msg.react(getEmoji('PEPEHappy'));
                });

            fs.writeFileSync('./resources/last-upload.txt', video);
        } else {
            console.log("No new uploads from Zodi.");
        }
    }).catch(err => console.log(err));
    setTimeout(checkNewUploads, 60000);
}

checkNewUploads();
client.login(process.env.ZODBOT_LOGIN);

module.exports = {
    client: client,
    youtube: youtube,
    getRole: getRole,
    getRoleById: getRoleById,
    getEmoji: getEmoji,
    getMember: getMember
}