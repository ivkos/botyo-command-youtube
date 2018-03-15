# YouTube Command for Botyo
[![npm](https://img.shields.io/npm/v/botyo-command-youtube.svg)](https://www.npmjs.com/package/botyo-command-youtube)
[![npm](https://img.shields.io/npm/dt/botyo-command-youtube.svg)](https://www.npmjs.com/package/botyo-command-youtube)
[![npm](https://img.shields.io/npm/l/botyo-command-youtube.svg)]()

The **YouTube Command for [Botyo](https://github.com/ivkos/botyo)** posts a YouTube video to the chat.

## Usage
`#yt <search query>`
or
`#youtube <search query>`

For example:
- `#yt Starboy`
- `#yt ozzy man cat vs mantis`

## Requirements
You need to obtain an API key to use the YouTube Data API. Please refer to the [YouTube API Reference](https://developers.google.com/youtube/v3/docs/#calling-the-api) for instructions how to do so.

## Install
**Step 1.** Install the module from npm.

`npm install --save botyo-command-youtube`

**Step 2.** Configure the API key in your configuration file `config.yaml`
```yaml
modules:
  YouTubeCommand:
    apiKey: YOUR_YOUTUBE_API_KEY # https://developers.google.com/youtube/v3/docs/#calling-the-api
```

**Step 3.** Register the module.
```typescript
import Botyo from "botyo";
import YouTubeCommand from "botyo-command-youtube"

Botyo.builder()
    ...
    .registerModule(YouTubeCommand)
    ...
    .build()
    .start();
```

## Configuration
The configuration of the YouTube command modules has some sensible defaults. However, you can still override the 
defaults if you need to.
```yaml
modules:
  YouTubeCommand:
    apiKey: YOUR_YOUTUBE_API_KEY # https://developers.google.com/youtube/v3/docs/#calling-the-api
    regionCode: US               # Return search results for the specified country. (ISO 3166-1 alpha-2 country code)
    order: relevance             # Method to use to order videos: date/rating/relevance/title/viewCount
    safeSearch: moderate         # Indicates whether the search results should include restricted content as well as standard content; moderate/none/strict
```

You can override all configuration properties (except `apiKey`) on a per-chat-thread basis. For example:
```yaml
modules:
  YouTubeCommand:
    apiKey: YOUR_YOUTUBE_API_KEY
    regionCode: US
    order: relevance
    safeSearch: moderate

chat-threads:
  SOME_CHAT_THREAD_ID:
    overrides:
      modules.YouTubeCommand:
        regionCode: BG
        order: viewCount
  OTHER_CHAT_THREAD_ID:
    overrides:
      modules.YouTubeCommand:
        enable: false     # disables the command for this chat thread
```