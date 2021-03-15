module.exports = {
    name: 'rolemsg',
    description: "Sends a message which members can add a reaction to in order to receive a specified role",
    execute(message, args) {
        if (!message.member.roles.cache.some(r => r.name === 'Owner' || r.name === 'Admin')) return message.channel.send("You don't have permission to use this command.");
        if (args.length < 6)
            return message.channel.send("Invalid command usage. Please specify a role and a reaction emoji" +
                "\n`z/rolemsg roles: [roles] reactions: [reactions] content: <message content>`" +
                "\n The first role corresponds to the first reaction, the second role corresponds to the second reaction and so on.");

        const fs = require('fs');

        var roles = [];
        var reactions = [];
        var messageContents = [];
        var unknowns = [];

        let role = false,
            reaction = false,
            content = false;

        for (var i = 0; i < args.length; i++) {
            if (args[i] === 'roles:') {
                role = true;
                reaction = false;
                content = false;
                continue;
            } else if (args[i] === 'reactions:') {
                role = false;
                reaction = true;
                content = false;
                continue;
            } else if (args[i] === 'content:') {
                role = false;
                reaction = false;
                content = true;
                continue;
            } else {
                (role ? roles : reaction ? reactions : content ? messageContents : unknowns).push(args[i]);
            }
        }
        if (unknowns.length > 0 || roles.length !== reactions.length) return;

        var messageContent = messageContents.join(' ').trim();

        var reaction_roles = {};
        for (var i = 0; i < roles.length; i++) {
            const roleID = roles[i].substring(3, (roles[i].length - 1));

            reaction_roles[reactions[i]] = roleID;
        }

        var roleMessages = JSON.parse(fs.readFileSync('././resources/role-messages.json'));

        message.channel.send(messageContent).then(msg => {
            const id = msg.id;

            roleMessages[id] = reaction_roles;
            reactions.forEach(r => {
                msg.react(r);
            });

            fs.writeFileSync('././resources/role-messages.json', JSON.stringify(roleMessages, null, '\t'));
            message.delete();
        });
    }
}