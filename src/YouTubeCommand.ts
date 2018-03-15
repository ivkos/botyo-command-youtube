import { AbstractCommandModule, Message } from "botyo-api";

const YouTube = require("youtube-api");

export default class YouTubeCommand extends AbstractCommandModule
{
    constructor()
    {
        super();

        YouTube.authenticate({
            type: "key",
            key: this.getRuntime().getConfiguration().getProperty("apiKey")
        });
    }

    getCommand(): string | string[]
    {
        return ["yt", "youtube"];
    }

    getDescription(): string
    {
        return "Posts a YouTube video in the chat"
    }

    getUsage(): string
    {
        return "<serach query>";
    }

    validate(msg: any, args: string): boolean
    {
        return !!args && args.length > 0;
    }

    async execute(msg: any, args: string): Promise<any>
    {
        const api = this.getRuntime().getChatApi();

        const video = await this.findVideo(msg, args);

        if (video === undefined) {
            return api.sendMessage(msg.threadID, "No results. \u{1F615}");
        }

        return api.sendMessage(msg.threadID, {
            url: video.url,
            body: `\u{1F4FC} ${video.title}\n\u{1F517} ${video.url}`
        });
    }

    private async findVideo(ctx: Message, query: string): Promise<any>
    {
        return new Promise((resolve, reject) => {
            YouTube.search.list(this.makeOptions(ctx, query), (err: Error, data: any) => {
                if (err) return reject(err);
                if (!data.items) return reject(new Error("Could not parse response"));
                if (data.items.length === 0) return resolve();

                const firstVideo = data.items[0];

                const video = {
                    url: YouTubeCommand.getShortUrl(firstVideo.id.videoId),
                    title: firstVideo.snippet.title
                };

                return resolve(video);
            });
        });
    }

    private makeOptions(context: Message, query: string)
    {
        const config = this.getRuntime()
            .getConfiguration()
            .inContext(context)
            .ofChatThread();

        return {
            q: query,
            part: "id,snippet",
            regionCode: config.getOrElse("regionCode", "US"),
            order: config.getOrElse("order", "relevance"),
            safeSearch: config.getOrElse("safeSearch", "moderate"),
            maxResults: 1 // we are only posting 1 video to the chat
        }
    }

    private static getShortUrl(videoId: string): string
    {
        return "https://youtu.be/" + videoId;
    }
}