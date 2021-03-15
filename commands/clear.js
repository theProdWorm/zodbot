module.exports = {
    name: 'clear',
    description: "Clears the specified amount of messages",
    execute(message, args) {
        if (message.channel.type === 'dm')
            return message.channel.send("Cannot clear messages in DM channels.");

        if (message.member.roles.cache.some(r => r.name === 'Owner' || r.name === 'Admin' || r.name === 'Discord Mod')) {
            let lim = parseInt(args[0]);
            if (lim >= 100)
                return message.channel.send("Maximum value is 99");
            if (typeof lim === typeof undefined || lim === NaN)
                return console.log("Please specify the desired amount of messages to remove.");

            async function clear() {
                const fetched = await message.channel.messages.fetch({ limit: lim + 1 });
                message.channel.bulkDelete(fetched);
            }
            clear();
        } else {
            message.channel.send("You don't have permission to use that command.");
        }
    }
}