module.exports = {
    name: 'pb',
    description: "Gets Zodi's personal bests.",
    execute(message, args) {
        const fs = require('fs');

        if (args.length < 1) {
            require('./help.js').execute(message, ['pb']);
            return;
        }

        const pb_dict = JSON.parse(fs.readFileSync('././pbs.json/'));

        var amount_of_pbs = 0;
        var amount_of_pbs_per_version = {};
        for (const v of Object.keys(pb_dict)) {
            amount_of_pbs += Object.keys(pb_dict[v]).length;
            amount_of_pbs_per_version[v] = Object.keys(pb_dict[v]).length;
        }

        switch (args[0]) {
            case 'all':
            case 'list':
                if (amount_of_pbs < 1) {
                    message.channel.send("There are currently no PBs registered in the databank. If you believe this to be an error, contact server staff.");
                    return;
                }

                var all_pbs = "";

                if (args.length < 2) { // Command: pb all/list
                    for (var version of Object.keys(pb_dict)) {
                        for (var pb_index of Object.keys(pb_dict[version])) {
                            all_pbs += `${pb_dict[version][pb_index]} (${version})\n`;
                        }
                    }

                    all_pbs.trim();
                    message.channel.send("All of Zodi's PBs (all versions):```" + all_pbs + "```");

                    return;
                }

                if (typeof Object.keys(pb_dict).find(version => version == args[1]) != typeof "") {
                    message.channel.send("That version is not in the registry.");
                    return;
                }

                for (var v of Object.keys(pb_dict)) {
                    if (v === args[1]) {
                        for (var pb_index of Object.keys(pb_dict[args[1]])) {
                            all_pbs += `${pb_dict[args[1]][pb_index]}\n`;
                        }
                        all_pbs.trim();
                        if (all_pbs === '') {
                            message.channel.send("There are currently no PBs for this version.");
                            return;
                        }

                        message.channel.send(`All of Zodi's PBs (${args[1]})` + "```" + all_pbs + "```");
                        return;
                    }
                }

                console.log("That version is not in the registry.");
                break;
            case 'current':
                if (amount_of_pbs < 1) {
                    message.channel.send("There are currently no PBs registered in the databank. If you believe this to be an error, contact server staff.");
                    return;
                }

                if (args.length < 2) {
                    require('./help').execute(message, ['pb']);
                    return;
                }

                let versionExists = false;
                for (var v of Object.keys(pb_dict)) {
                    if (v === args[1]) {
                        versionExists = true;
                        break;
                    }
                }

                if (!versionExists) {
                    message.channel.send("That version is not in the registry.");
                    return;
                }

                const current_pb = pb_dict[args[1]][Object.keys(pb_dict[args[1]])[Object.keys(pb_dict[args[1]]).length - 1]];

                message.channel.send("Zodi's current PB:```\n" + current_pb + "```");

                break;
            case 'new':
            case 'add':
                if (message.member.roles.cache.some(r => r.name === 'Owner' || r.name === 'Admin')) {

                    if (args.length < 3) {
                        require('./help').execute(message, ['pb']);
                        return;
                    }

                    if (typeof Object.keys(pb_dict).find(version => version == args[1]) != typeof "") {
                        message.channel.send("That version is not in the registry.");
                        return;
                    }

                    pb_dict[args[1]][amount_of_pbs + 1] = args[2];

                    fs.writeFileSync('././pbs.json', JSON.stringify(pb_dict));

                    console.log('Saved new PB!');

                    message.channel.send("New PB saved!")
                        .then(function(message) {
                            message.react("🥳");
                            message.react("😎");
                        }).catch(function() {
                            console.log("Something went wrong.");
                        });
                } else {
                    message.channel.send("You don't have permission to do that.");
                }
                break;
            case 'remove':
            case 'removelast':
                if (message.member.roles.cache.some(r => r.name === 'Owner' || r.name === 'Admin')) {
                    if (amount_of_pbs < 1) {
                        message.channel.send("There are currently no PBs registered in the databank. If you believe this to be an error, contact server staff.");
                        return;
                    }

                    var max_index = '0',
                        max_version = '';

                    for (var version of Object.keys(pb_dict)) {
                        for (var pb_index of Object.keys(pb_dict[version])) {
                            if (parseInt(max_index) < parseInt(pb_index)) {
                                max_index = pb_index;
                                max_version = version;
                            }
                        }
                    }

                    console.log(max_index + ': ' + max_version);
                    console.log(delete pb_dict[max_version][max_index]);

                    fs.writeFileSync('././pbs.json', JSON.stringify(pb_dict));

                    message.channel.send("Removed last PB entry.")
                        .then(function(message) {
                            message.react("😪");
                        })
                } else {
                    message.channel.send("You don't have permission to do that.");
                }
                break;
            case 'newversion':


                // Add a new version to the pbs.json dictionary


                break;
        }
    }
}