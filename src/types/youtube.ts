export type YouTubeId = {
  videoId?: string;
  channelId?: string;
  playlistId?: string;
};

export type YouTubeThumbnail = {
  url: string;
};

export type YouTubeSnippet = {
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnails: {
    default?: YouTubeThumbnail;
    medium?: YouTubeThumbnail;
    high?: YouTubeThumbnail;
  };
};

export type YouTubeSearchItem = {
  id: YouTubeId;
  snippet: YouTubeSnippet;
};

export type YouTubeSearchResponse = {
  items: YouTubeSearchItem[];
};

export type YouTubeVideoStatistics = {
  viewCount: string;
  likeCount?: string;
  commentCount?: string;
};

export type YouTubeVideoDetail = {
  id: string;
  snippet: YouTubeSnippet;
  statistics?: YouTubeVideoStatistics;
};

export type YouTubeVideoDetailsResponse = {
  items: YouTubeVideoDetail[];
};

export type YouTubeCommentSnippet = {
  textDisplay: string;
  authorDisplayName: string;
  likeCount: number;
  publishedAt: string;
};

export type YouTubeCommentThread = {
  id: string;
  snippet: {
    topLevelComment: {
      id: string;
      snippet: YouTubeCommentSnippet;
    };
  };
};

export type YouTubeCommentsResponse = {
  items: YouTubeCommentThread[];
  nextPageToken?: string;
};
