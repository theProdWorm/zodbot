module.exports = {
    name: 'youtube',
    description: "Searches YouTube for query",
    execute(message, args) {
        const google = require('googleapis').google;
        const youtube = google.youtube('v3');



        youtube.search.list({
            key: process.env.YOUTUBE_TOKEN,
            part: 'contentDetails',
            q: args.join(' '),
            maxResults: 5
        }).then(response => {
            const videos = response.data.items.forEach(v => {
                const video = v.contentDetails.upload.videoId;
                const url = `https://youtube.com/watch?v=${video}`;

                return url;
            }).join('\n');

        }).catch(err => console.log(err));
    }
}