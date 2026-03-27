import { useRef, useState } from "react";
function VideoPlayer() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function handlePlayPause() {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  function handleMute() {
    videoRef.current.muted = !videoRef.current.muted;
  }

  function handleFastForward() {
    videoRef.current.currentTime += 5; // Skip 5 seconds
  }

  return (
    <div className="max-w-2xl mx-auto bg-black p-4 rounded-lg space-y-4">
      <video ref={videoRef} width="100%" height="400" className="rounded">
        <source
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          type="video/mp4"
        />
      </video>

      <div className="flex gap-2">
        <button
          onClick={handlePlayPause}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isPlaying ? "⏸️ Pause" : "▶️ Play"}
        </button>

        <button
          onClick={handleMute}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          🔇 Mute
        </button>

        <button
          onClick={handleFastForward}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          ⏩ +5s
        </button>
      </div>
    </div>
  );
}

export default VideoPlayer;
