import { FFmpeg } from "https://unpkg.com/@ffmpeg/ffmpeg@0.12.15/dist/umd/ffmpeg.js";

const btn = document.getElementById("convert");
const status = document.getElementById("status");

btn.onclick = async () => {
    const fileInput = document.getElementById("upload");
    if (!fileInput.files.length) return alert("Pilih file dulu!");

    const file = fileInput.files[0];

    status.innerText = "Loading FFmpeg...";
    const ffmpeg = new FFmpeg();

    // wajib karena .wasm dan worker di folder yang sama
    await ffmpeg.load({
        coreURL: "https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd/ffmpeg-core.js",
    });

    status.innerText = "Processing...";
    await ffmpeg.writeFile("input.webm", await file.arrayBuffer());
    await ffmpeg.exec(["-i", "input.webm", "output.mp4"]);
    const data = await ffmpeg.readFile("output.mp4");

    const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.mp4";
    a.click();

    status.innerText = "Done!";
};
