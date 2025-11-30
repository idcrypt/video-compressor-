const input = document.getElementById("inputVideo");
const btn = document.getElementById("convertBtn");
const progress = document.getElementById("progress");

btn.onclick = async () => {
  if (!input.files.length) return alert("Select a file first");
  btn.disabled = true;

  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({
    corePath: "libs/ffmpeg-core.js",
    onProgress: ({ ratio }) => (progress.value = ratio)
  });

  await ffmpeg.load();
  const file = input.files[0];

  ffmpeg.FS("writeFile", "input", await fetchFile(file));
  await ffmpeg.run("-i", "input", "output.mp4");

  const data = ffmpeg.FS("readFile", "output.mp4");
  const blob = new Blob([data.buffer], { type: "video/mp4" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "output.mp4";
  a.click();

  btn.disabled = false;
};
