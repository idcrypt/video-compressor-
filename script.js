import { createFFmpeg, fetchFile } from "./libs/ffmpeg.min.js";

const ffmpeg = createFFmpeg({
  log: true,
  corePath: "./libs/ffmpeg-core.js",
  workerPath: "./libs/ffmpeg-worker.min.js",
});

const uploader = document.getElementById("uploader");
const startBtn = document.getElementById("startBtn");
const progressBox = document.getElementById("progressBox");
const progressFill = document.getElementById("progressFill");
const statusText = document.getElementById("statusText");
const downloadLink = document.getElementById("downloadLink");

startBtn.onclick = async () => {
  const file = uploader.files[0];
  if (!file) {
    alert("Please select a video file first.");
    return;
  }

  progressBox.style.display = "block";
  progressFill.style.width = "0%";
  statusText.textContent = "Loading FFmpeg...";

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  statusText.textContent = "Compressing video...";
  ffmpeg.setProgress(({ ratio }) => {
    progressFill.style.width = `${Math.round(ratio * 100)}%`;
  });

  ffmpeg.FS("writeFile", "input.mp4", await fetchFile(file));

  await ffmpeg.run(
    "-i", "input.mp4",
    "-vf", "scale=-1:720",
    "-c:v", "libx264",
    "-crf", "26",
    "-preset", "medium",
    "-c:a", "copy",
    "output.mp4"
  );

  const data = ffmpeg.FS("readFile", "output.mp4");
  const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));

  downloadLink.href = url;
  downloadLink.download = "compressed.mp4";
  downloadLink.style.display = "inline-block";
  downloadLink.textContent = "Download Video";
  statusText.textContent = "Completed!";
};
