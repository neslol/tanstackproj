import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Posts from "./components/Posts";
import VideoDetails from "./components/VideoDetails";

export function App() {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [pinnedVideoIds] = useState<string[]>([]);

  useQueries({
    queries: pinnedVideoIds.map((id) => ({
      queryKey: ["pinnedVideo", id],
      queryFn: () => Promise.resolve(null),
      enabled: false,
    })),
  });

  return (
    <>
      {selectedVideoId ? (
        <VideoDetails
          videoId={selectedVideoId}
          onBack={() => setSelectedVideoId(null)}
        />
      ) : (
        <>
          <p>
            Søg efter Youtube-videoer, ligesom på YouTube. Det er automatisk sat
            til "cats". Klik på en video for at se detaljer og kommentarer.
          </p>
          <Posts onSelectVideo={setSelectedVideoId} />
        </>
      )}
      <ReactQueryDevtools initialIsOpen />
    </>
  );
}

export default App;
