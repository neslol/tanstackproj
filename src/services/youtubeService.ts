import {
  useQuery,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import type {
  YouTubeSearchResponse,
  YouTubeVideoDetailsResponse,
  YouTubeCommentsResponse,
} from "../types/youtube";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export async function fetchYouTubeSearch(
  query: string
): Promise<YouTubeSearchResponse> {
  if (!YOUTUBE_API_KEY) {
    throw new Error("Missing YouTube API key (VITE_YOUTUBE_API_KEY)");
  }

  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    q: query,
    maxResults: "10",
    key: YOUTUBE_API_KEY,
  });

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `YouTube API error: ${response.status} ${response.statusText} - ${text}`
    );
  }

  return (await response.json()) as YouTubeSearchResponse;
}

export function useYouTubeSearch(query: string) {
  return useQuery({
    queryKey: ["youtubeSearch", query],
    queryFn: async (): Promise<YouTubeSearchResponse> => {
      return fetchYouTubeSearch(query);
    },
    placeholderData: keepPreviousData,
  });
}

export async function fetchYouTubeVideoDetails(
  videoId: string
): Promise<YouTubeVideoDetailsResponse> {
  if (!YOUTUBE_API_KEY) {
    throw new Error("Missing YouTube API key (VITE_YOUTUBE_API_KEY)");
  }

  const params = new URLSearchParams({
    part: "snippet,statistics",
    id: videoId,
    key: YOUTUBE_API_KEY,
  });

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `YouTube API error: ${response.status} ${response.statusText} - ${text}`
    );
  }

  return (await response.json()) as YouTubeVideoDetailsResponse;
}

export async function fetchYouTubeComments(
  videoId: string,
  pageToken?: string
): Promise<YouTubeCommentsResponse> {
  if (!YOUTUBE_API_KEY) {
    throw new Error("Missing YouTube API key (VITE_YOUTUBE_API_KEY)");
  }

  const params = new URLSearchParams({
    part: "snippet",
    videoId,
    maxResults: "10",
    textFormat: "plainText",
    key: YOUTUBE_API_KEY,
  });

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/commentThreads?${params.toString()}`
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `YouTube API error: ${response.status} ${response.statusText} - ${text}`
    );
  }

  return (await response.json()) as YouTubeCommentsResponse;
}

export function useYouTubeVideo(videoId: string | null) {
  return useQuery({
    queryKey: ["youtubeVideo", videoId],
    enabled: !!videoId,
    queryFn: async (): Promise<YouTubeVideoDetailsResponse> => {
      return fetchYouTubeVideoDetails(videoId as string);
    },
  });
}

export function useYouTubeComments(videoId: string | null) {
  return useQuery({
    queryKey: ["youtubeComments", videoId],
    enabled: !!videoId,
    queryFn: async (): Promise<YouTubeCommentsResponse> => {
      return fetchYouTubeComments(videoId as string);
    },
  });
}

export function useYouTubeCommentsInfinite(videoId: string | null) {
  return useInfiniteQuery({
    queryKey: ["youtubeCommentsInfinite", videoId],
    enabled: !!videoId,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }): Promise<YouTubeCommentsResponse> => {
      return fetchYouTubeComments(videoId as string, pageParam);
    },
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
  });
}
