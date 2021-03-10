const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = 'z/';
const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

// Initialize
client.once('ready', () => {
    console.log('ZodBot is online!');
});

// Welcome new members in the "📢welcome📢" text channel
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === '📢welcome📢');
    channel.type = 'text';
    if (!channel) {
        console.log("Could not find the 📢welcome📢 channel");
        return;
    }

    channel.messages.fetch({ limit: 1 }).then(msgs => {
        msgs.forEach(msg => {
            msg.delete();
        });
    });

    channel.send(`Hello ${member}! Welcome to ${member.guild.name}!`);
});

client.on("presenceUpdate", (oldPresence, newPresence) => {
    if (!newPresence.activities) {
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
                .send(`${getRole('TwitchAnnouncements')} zodisp is now streaming at ${activity.url} !`)
                .then(message => {
                    message.react(getEmoji('ZodChair'));
                });

            getRole('TwitchAnnouncementsDM').members.forEach(mem => {
                let username = mem.user.username;

                msgUser(username, `zodisp is now streaming at ${activity.url} !`);
            })

            return true;
        }
    }
});

client.on('message', message => {
    if (message.content.match(/^(:[^:\s]+:|<:[^:\s]:[0-9]+>|<a:[^:\s]+:[0-9]+>)+$/))
        message.channel.send(message.guild.emojis.cache.find(e => e.name === 'ZodChair'));

    if (message.channel.type === 'dm' && !message.author.bot) {
        fs.writeFileSync('./DM-log.txt', `${message.author.username}: ${message.content}`);
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'help':
            client.commands.get('help').execute(message, args);
            break;
        case 'ping':
            client.commands.get('ping').execute(message, args);
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
    }
});

function getRole(roleName) {
    let roles = client.guilds.cache.find(g => g.name === 'ZodGod').roles.cache;
    let role = roles.find(r => r.name === roleName);

    return role;
}

function msgUser(username, text) {
    let members = client.guilds.cache.find(g => g.name === 'ZodGod').members.cache;
    let user = members.find(m => m.user.username === username);

    user.createDM().then(dm_channel => {
        return dm_channel.send(text);
    }).catch(() => {
        console.log("Could not create DM. User probably blocked me :(");
    });
}


client.login(fs.readFileSync('C:\\Users\\Emil\\Desktop\\ZodBot-login.txt')); // Confidential