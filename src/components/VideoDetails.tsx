import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { YouTubeVideoDetailsResponse } from "../types/youtube";
import {
  useYouTubeVideo,
  useYouTubeCommentsInfinite,
} from "../services/youtubeService";

type VideoDetailsProps = {
  videoId: string;
  onBack: () => void;
};

export function VideoDetails({ videoId, onBack }: VideoDetailsProps) {
  const queryClient = useQueryClient();

  const {
    status: videoStatus,
    data: videoData,
    error: videoError,
  } = useYouTubeVideo(videoId);
  const {
    status: commentsStatus,
    data: commentsPages,
    error: commentsError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useYouTubeCommentsInfinite(videoId);

  const video = videoData?.items[0];

  const likeMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
    },
    onSuccess: () => {
      queryClient.setQueryData<YouTubeVideoDetailsResponse>(
        ["youtubeVideo", videoId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((item) => {
              if (item.id !== videoId || !item.statistics) return item;
              const currentLikes = Number(item.statistics.likeCount ?? "0");
              return {
                ...item,
                statistics: {
                  ...item.statistics,
                  likeCount: String(currentLikes + 1),
                },
              };
            }),
          };
        }
      );
    },
  });

  return (
    <div>
      <button onClick={onBack}>Back to results</button>

      {videoStatus === "pending" ? (
        <p>Loading video details...</p>
      ) : videoStatus === "error" ? (
        <p>Error: {(videoError as Error).message}</p>
      ) : !video ? (
        <p>No video details found.</p>
      ) : (
        <div>
          <h2>{video.snippet.title}</h2>
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={video.snippet.title}
            style={{
              width: "100%",
              maxWidth: "480px",
              display: "block",
            }}
          />
          <p>
            <strong>Channel:</strong> {video.snippet.channelTitle}
          </p>
          <p>
            <strong>Views:</strong> {video.statistics?.viewCount ?? "N/A"} |{" "}
            <strong>Likes:</strong> {video.statistics?.likeCount ?? "N/A"} |{" "}
            <strong>Comments:</strong> {video.statistics?.commentCount ?? "N/A"}
          </p>
          <button
            onClick={() => likeMutation.mutate()}
            disabled={likeMutation.isPending}
          >
            {likeMutation.isPending ? "Liking..." : "Like (local)"}
          </button>
          <p>{video.snippet.description}</p>
        </div>
      )}

      <hr />

      <h3>Comments</h3>
      {commentsStatus === "pending" ? (
        <p>Loading comments...</p>
      ) : commentsStatus === "error" ? (
        <p>Error: {(commentsError as Error).message}</p>
      ) : (
        <>
          <ul>
            {commentsPages?.pages
              .flatMap((page) => page.items)
              .map((thread) => {
                const comment = thread.snippet.topLevelComment.snippet;
                return (
                  <li key={thread.id}>
                    <p>
                      <strong>{comment.authorDisplayName}</strong> (
                      {comment.publishedAt})
                    </p>
                    <p>{comment.textDisplay}</p>
                    <p>Likes: {comment.likeCount}</p>
                  </li>
                );
              })}
          </ul>
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading more..." : "Load more comments"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default VideoDetails;
