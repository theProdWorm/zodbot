module.exports = {
    name: 'clear',
    description: "Clears the specified amount of messages",
    execute(message, args) {
        if (message.channel.type === 'dm') {
            message.channel.send("Cannot clear messages in DM channels.");
            return;
        }

        if (message.member.roles.cache.some(r => r.name === 'Owner' || r.name === 'Admin' || r.name === 'DiscordMod')) {
            let lim = parseInt(args[0]);
            if (typeof lim === typeof undefined || lim === NaN) {
                console.log("Please specify the desired amount of messages to remove.");
                return;
            }

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