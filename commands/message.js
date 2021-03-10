module.exports = {
    name: 'message',
    description: "Sends a message in the specified text channel.",
    execute(message, args) {
        if (args.length < 2) {
            message.channel.send("Invalid command usage. (placeholder)");
            return;
        }
        let channelIDs = [];

        for (var word of args) {
            if (word.match(/^(<#[0-9]+>)+$/)) {
                channelIDs.push(word.substring(2, word.length - 1));
            } else break;
        }
        channelIDs.forEach(id => {
            id = id.substring(2, id.length - 1);
        });

        let content = "";
        let reactions = [];

        let react = false;
        args.forEach(word => {
            if (args.indexOf(word) < channelIDs.length) return;
            if (word === 'react()') {
                react = true
                return;
            };

            if (react) reactions.push(word);
            else content += " " + word;
        });

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