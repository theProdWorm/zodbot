module.exports = {
    name: 'pfp',
    description: "Returns the profile pic of specified user.",
    execute(message, args) {

        args.forEach(u => {
            if (u.match(/^(<@![0-9]+>)+$/)) {
                let uID = u.substring(3, u.length - 1);
                let pfp = message.guild.members.cache.get(uID).user.avatar;

                console.log(pfp);
            }

        })
    }
}