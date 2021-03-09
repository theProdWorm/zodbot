module.exports = {
    name: 'help',
    description: "Gets help for a specified command, or returns a list of all commands.",
    execute(message, args) {
        const fs = require('fs');

        if (args.length < 1) {
            // Send a list of all commands

            message.channel.send("pb\nping\nhelp");

            return;
        }

        switch (args[0]) {
            case 'pb':
                let embed = JSON.parse(fs.readFileSync('././help-embeds.json'))[0];
                return message.channel.send(embed);
        }
    }
}