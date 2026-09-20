/* AI acknowledgement: OpenAI Codex generated the changes and comments with
student direction on 15 and 20 September 2026. Starter playback and progress
structure: Rohit Ashok Khot, https://rohitashokkhot.github.io/mediaplayer/.
The video is the course-supplied miac.mp4. No external JavaScript library is
used. This acknowledgement describes assistance rather than claiming that
all code was independently written by the student. */
const video = document.querySelector("#custom-video-player");
const playPauseBtn = document.querySelector("#play-pause-btn");
const progressBar = document.querySelector("#progress-bar-fill");
const seek = document.querySelector("#seek");
const currentTime = document.querySelector("#current-time");
const duration = document.querySelector("#duration");
const muteBtn = document.querySelector("#mute-btn");
const volume = document.querySelector("#volume");
const cinemaBtn = document.querySelector("#cinema-btn");
const playbackStatus = document.querySelector("#playback-status");
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  return Math.floor(seconds / 60) + ":" + String(Math.floor(seconds % 60)).padStart(2, "0");
}
/* Media events synchronise labels with actual playback, instead of assuming
that a click successfully started the video. A rejected play request produces
an explanatory message. Duration checks prevent invalid arithmetic before
metadata loads. Seeking and replay retain familiar behaviour; mute preserves
the previous volume. Cinema mode exposes its state through aria-pressed, and
Escape offers an immediate exit with focus returned to its button. These
feedback mechanisms help users understand both playback and viewing mode. */
async function togglePlayPause() {
  if (video.paused || video.ended) {
    try { await video.play(); }
    catch { playbackStatus.textContent = "Unable to play. Check your connection and try again."; }
  } else { video.pause(); }
}
function updateProgressBar() {
  const ready = Number.isFinite(video.duration) && video.duration > 0;
  const value = ready ? (video.currentTime / video.duration) * 100 : 0;
  progressBar.style.width = value + "%";
  seek.value = value;
  seek.disabled = !ready;
  currentTime.textContent = formatTime(video.currentTime);
  duration.textContent = formatTime(video.duration);
  seek.setAttribute("aria-valuetext", formatTime(video.currentTime) + " of " + formatTime(video.duration));
}
function updatePlayback() {
  playPauseBtn.textContent = video.ended ? "Play again" : video.paused ? "Play" : "Pause";
  playbackStatus.textContent = video.ended ? "End of video · play it again" : video.paused ? "Paused" : "Now playing";
}
function updateVolume() {
  const silent = video.muted || video.volume === 0;
  muteBtn.textContent = silent ? "Unmute" : "Mute";
  muteBtn.setAttribute("aria-pressed", String(silent));
  volume.value = video.muted ? 0 : video.volume;
}
function setCinema(enabled) {
  document.body.classList.toggle("cinema", enabled);
  cinemaBtn.setAttribute("aria-pressed", String(enabled));
  cinemaBtn.textContent = enabled ? "Exit cinema ↙" : "Cinema mode ↗";
}
playPauseBtn.addEventListener("click", togglePlayPause);
video.addEventListener("timeupdate", updateProgressBar);
video.addEventListener("loadedmetadata", updateProgressBar);
video.addEventListener("durationchange", updateProgressBar);
["play", "pause", "ended", "playing"].forEach(event => video.addEventListener(event, updatePlayback));
video.addEventListener("waiting", () => { playbackStatus.textContent = "Buffering…"; });
video.addEventListener("error", () => { playbackStatus.textContent = "Video unavailable. Check your connection and reload."; });
seek.addEventListener("input", () => {
  if (Number.isFinite(video.duration)) video.currentTime = (Number(seek.value) / 100) * video.duration;
  updateProgressBar();
});
document.querySelector("#replay-btn").addEventListener("click", () => {
  video.currentTime = 0;
  updateProgressBar();
  video.pause();
  togglePlayPause();
});
muteBtn.addEventListener("click", () => {
  const silent = video.muted || video.volume === 0;
  if (silent && video.volume === 0) video.volume = 0.7;
  video.muted = !silent;
});
volume.addEventListener("input", () => {
  video.volume = Number(volume.value);
  video.muted = video.volume === 0;
});
video.addEventListener("volumechange", updateVolume);
cinemaBtn.addEventListener("click", () => setCinema(!document.body.classList.contains("cinema")));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && document.body.classList.contains("cinema")) { setCinema(false); cinemaBtn.focus(); }
});
video.volume = 0.7;
updateProgressBar();
updateVolume();
video.removeAttribute("controls");
document.querySelector(".custom-controls").hidden = false;
