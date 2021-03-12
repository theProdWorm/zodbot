module.exports = {
    name: 'clog',
    description: "Logs message to console.",
    execute(message, args) {
        console.log(args.join('\n'));
    }

    /*
        user:
        <@!123456789012345678>

        role:
        <@&123456789012345678>

        text-channel:
        <#818076034494758942>

        custom-emoji:
        <:emojiName:123456789012345678>

        standard-emoji:
        :muscle:
     */
}