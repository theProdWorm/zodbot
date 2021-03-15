module.exports = {
    name: 'message',
    description: "Sends a message in the specified text channel.",
    execute(message, args) {
        if (!message.member.roles.cache.some(r => r.name === 'Owner' || r.name === 'Admin' || r.name === 'Discord Mod'))
            return message.channel.send("You do not have permission to use this command.");

        if (args.length < 2)
            return message.channel.send("Invalid command usage.");
        let channelIDs = [];

        for (var channel of args) {
            if (channel.match(/^(<#[0-9]+>)+$/)) {
                channelIDs.push(channel.substring(2, channel.length - 1));
            } else break;
        }

        let content = "";
        let reactions = [];

        let react = false,
            spam = false;

        let spamArray = [];

        args.forEach(word => {
            if (args.indexOf(word) < channelIDs.length) return;
            if (word === 'react()') {
                react = true;
                spam = false;
                return;
            } else if (word === 'spam()') {
                react = false;
                spam = true;
                return;
            }

            if (react) reactions.push(word);
            else if (spam) {
                let times = parseInt(word);
                if (typeof times === 'number') {
                    for (var i = 0; i < (times - 1); i++) {
                        spamArray = spamArray.concat(channelIDs);
                    }
                } else {
                    message.channel.send("Argument after spam() must be a number");
                }
            } else content += " " + word;
        });
        channelIDs = channelIDs.concat(spamArray);

        channelIDs.forEach(id => {
            let channel = message.guild.channels.cache.get(id);

            channel.send(content).then(msg => {
                reactions.forEach(e => {
                    msg.react(e);
                });
            });
        });

        message.delete();
    }
}