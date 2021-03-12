module.exports = {
    name: 'mute',
    description: "Mutes a user for the specified amount of time in minutes",
    execute(message, args) {
        if (args.length < 2) {
            message.channel.send("Not enough arguments passed. Please specify a user and a timeout (minutes).");
            return;
        }
        if (!args[0].match(/^(<@![0-9]+>|<@[0-9]+>)+$/) || typeof parseInt(args[1], 10) !== 'number') {
            message.channel.send("Please specifiy a user and a timeout time (minutes).");
            console.log(args);
            return;
        }
        if (!message.member.roles.cache.some(r => r.name === 'Owner' || r.name === 'Admin' || r.name === 'Discord Mod')) {
            message.channel.send("You do not have permission to use this command.");
            return;
        }

        const fs = require('fs');
        var mutedUsers = JSON.parse(fs.readFileSync('././resources/muted-users.json'));

        const muted = require('../main').getRole('Muted');
        const member = require('../main')
            .getMember(args[0]
                .substring(args[0]
                    .includes('!') ? 3 : 2, args[0].length - 1));

        if (Object.keys(mutedUsers).includes(member)) return;
        if (muted === null || muted === undefined) {
            message.channel.send("Could not find the 'Muted' role.");
            return;
        }
        if (member === null || member === undefined) {
            message.channel.send("I could not find that member.");
            return;
        }
        member.roles.add(muted);
        message.channel.send(`${member} has been muted.`);

        const timeout = (parseInt(args[1], 10) * 60000);
        mutedUsers[member.id] = timeout;

        fs.writeFileSync('././resources/muted-users.json', JSON.stringify(mutedUsers));

        setTimeout(() => {
            member.roles.remove(muted);
            message.channel.send(`${member} is no longer muted.`);

            delete mutedUsers[member.id];
            fs.writeFileSync('./resources/muted-users.json', JSON.stringify(mutedUsers));
        }, timeout);
    }
}