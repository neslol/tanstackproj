import * as React from "react";
import { useYouTubeSearch } from "../services/youtubeService";
import "../index.css";

type PostsProps = {
  onSelectVideo: (videoId: string) => void;
};

export function Posts({ onSelectVideo }: PostsProps) {
  const [inputValue, setInputValue] = React.useState("cats");
  const [searchTerm, setSearchTerm] = React.useState("cats");
  const { status, data, error, isFetching } = useYouTubeSearch(searchTerm);

  return (
    <div>
      <h1>YouTube Search</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearchTerm(inputValue);
        }}
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search YouTube videos..."
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {status === "pending" ? (
          "Loading..."
        ) : status === "error" ? (
          <span>Error: {(error as Error).message}</span>
        ) : (
          <>
            <div>
              {data?.items.map((item) => {
                const videoId = item.id.videoId;

                if (!videoId) {
                  return null;
                }

                return (
                  <div
                    key={videoId}
                    style={{ cursor: "pointer", marginBottom: "1rem" }}
                    onClick={() => onSelectVideo(videoId)}
                    id="video-item"
                  >
                    {item.id.videoId && (
                      <img
                        src={`https://img.youtube.com/vi/${item.id.videoId}/maxresdefault.jpg`}
                        alt={item.snippet.title}
                        style={{
                          width: "100%",
                          maxWidth: "480px",
                          display: "block",
                        }}
                      />
                    )}
                    <h2>{item.snippet.title}</h2>
                    <div>{item.snippet.channelTitle}</div>
                    <p>{item.snippet.description}</p>
                  </div>
                );
              })}
            </div>
            <div>{isFetching ? "Background Updating..." : " "}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default Posts;
