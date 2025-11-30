const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
  corePath: 'libs/ffmpeg-core.js',
  log: true,
});

const uploader = document.getElementById('uploader');
const progressBox = document.getElementById('progressBox');
const progressFill = document.getElementById('progressFill');
const statusText = document.getElementById('statusText');
const downloadLink = document.getElementById('downloadLink');

uploader.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  progressBox.classList.remove('hidden');
  statusText.textContent = "Loading FFmpeg...";

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  statusText.textContent = "Compressing video to 480p...";
  progressFill.style.width = "0%";

  ffmpeg.setProgress(({ ratio }) => {
    progressFill.style.width = `${Math.round(ratio * 100)}%`;
  });

  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));

  await ffmpeg.run(
    '-i', 'input.mp4',
    '-vf', 'scale=-1:480',
    '-c:v', 'libx264',
    '-crf', '26',
    '-preset', 'medium',
    '-c:a', 'copy',
    'output.mp4'
  );

  const data = ffmpeg.FS('readFile', 'output.mp4');
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

  downloadLink.href = url;
  downloadLink.classList.remove('hidden');
  statusText.textContent = "Done — Click download.";
});
