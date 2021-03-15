module.exports = {
    name: 'warn',
    description: "Adds a warning to the specified user, with the specified reason.",
    execute(message, args) {
        if (args.length < 2) return message.channel.send("Please specify a user and a reason.");

        if (!args[0].startsWith('<@!')) return;
        const fs = require('fs');
        const userID = args[0].substring(3, (args[0].length - 1));

        let userWarningsList = JSON.parse(fs.readFileSync('./resources/user-warnings.json'));

        let user = args.shift();
        const reason = args.join(' ');
        args.unshift(user);

        var warnings = 1,
            timeout =
            reason.toLowerCase() === 'profanity' ? 15 :
            reason.toLowerCase() === 'spam' ? 20 :
            reason.length > 15 ? 30 :
            20,
            reasons = [];

        if (userWarningsList[userID]) {
            warnings += userWarningsList[userID].warnings;
            timeout += userWarningsList[userID].timeout;
            userWarningsList[userID].reasons.forEach(r => {
                reasons.push(r);
            });
        }
        reasons.push(reason);

        message.channel.send(warnings === 1 ? args[0] + ' First warning.' : warnings === 2 ? args[0] + ' Second and final warning.' : '💢‼🤐').then(msg => {
            if (warnings > 1) msg.react('‼');
        });

        if (warnings >= 3) {
            require('../main.js').client.commands.get('mute').execute(message, [`${args[0]}`, "10"]);
            warnings = 0;
            timeout = 0;
            reasons = [];
        }

        const userWarnings = {
            warnings: warnings,
            timeout: timeout,
            reasons: reasons
        }
        userWarningsList[userID] = userWarnings;

        fs.writeFileSync('././resources/user-warnings.json', JSON.stringify(userWarningsList, null, '\t'));
    }
}