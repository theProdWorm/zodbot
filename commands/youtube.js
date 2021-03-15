module.exports = {
    name: 'youtube',
    description: "Searches YouTube for query",
    execute(message, args) {
        if (args.length < 1) {
            message.channel.send("https://www.youtube.com/channel/UCBb4eNzHMUpFnNWskn0mTOg")
            return;
        }

        require('dotenv').config();
        const youtube = require('../main').youtube;

        youtube.search.list({
            key: process.env.YOUTUBE_TOKEN,
            part: 'snippet',
            type: 'youtube#video',
            q: args.join(' '),
            maxResults: 5
        }).then(response => {
            var videos = [];

            response.data.items.forEach(result => {
                const videoTitle = result.snippet.title;
                const videoID = result.id.videoId;
                const url = `https://youtube.com/watch?v=${videoID}`;

                const embed = {
                    embed: {
                        title: [videoTitle],
                        url: [url],
                        color: 15540740
                    }
                }

                videos.push(embed);
            });
            videos = videos.join('\n');

            message.channel.send(videos);
        }).catch(err => console.log(err));
    }
}