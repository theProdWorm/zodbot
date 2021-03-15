const fs = require('fs');
const paginationEmbed = require('discord.js-pagination');
const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: "Gets help for a specified command, or returns a list of all commands.",
    execute(message, args) {

        if (args.length < 1) {
            const page1 = new Discord.MessageEmbed()
                .setTitle("Public")
                .setColor(15540740)
                .addField("`z/help`", "Sends help for a specified command, like this. If no command is given, sends the list you're currently viewing instead")
                .addField("`z/pb`", "Returns a list of pbs depending on the subcommand specified")
                .addField("`z/youtube`", "If no arguments are given, sends a link to Zodi's YouTube channel. If arguments are given, searches YouTube for query and returns a list of the first 5 results")
                .addField("`z/ping`", "If you for some reason want ZodBot to say \"pong!\"");

            const page2 = new Discord.MessageEmbed()
                .setTitle("Staff only")
                .setColor(15540740)
                .addField("`z/clear`", "Clear a specified amount of messages in the current channel")
                .addField("`z/message`", "Makes ZodBot send a message in the specified channel, and add the specified reactions to that message")
                .addField("`z/rolemsg`", "Sends a message which members can react to in order to get the corresponding role")
                .addField("`z/log`", "Logs a message to the console");

            const embeds = [page1, page2]

            paginationEmbed(message, embeds, ['⬅', '➡'], 150000);
            return;
        }

        switch (args[0]) {
            case 'pb':
                let embed = JSON.parse(fs.readFileSync('././resources/help-embeds.json'))['pb'];
                return message.channel.send(embed);
        }
    }
}