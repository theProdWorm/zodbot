module.exports = {
    name: 'video',
    description: "Retrieves Zodi's last video from YouTube.",
    execute(message) {
        require('../main.js').youtube.activities.list({
            key: process.env.YOUTUBE_TOKEN,
            part: 'contentDetails',
            channelId: 'UCBb4eNzHMUpFnNWskn0mTOg',
            maxResults: 1
        }).then(response => {
            const video = response.data.items[0].contentDetails.upload.videoId;

            message.channel.send(`https://youtube.com/watch?v=${video}`);
        });
    }
}