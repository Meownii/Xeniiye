const pageNames = {
  home: 'A LITTLE HELLO', about: 'ABOUT ME', commissions: 'COMMISSIONS',
  shop: 'SHOP', terms: 'TERMS', contact: 'CONTACT', feedback: 'FEEDBACK'
};
const navLinks = [...document.querySelectorAll('.nav-link[data-section]')];
const pages = [...document.querySelectorAll('.page-content[data-page]')];
const pageLocation = document.querySelector('#pageLocation');
function showPage(name) {
  pages.forEach(page => {
    const active = page.dataset.page === name;
    page.classList.toggle('is-visible', active);
    page.hidden = !active;
  });
  navLinks.forEach(link => {
    const active = link.dataset.section === name;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  pageLocation.textContent = pageNames[name];
  document.title = `${name === 'home' ? 'Xeniiye' : pageNames[name].replace(/\b\w/g, m => m.toUpperCase())} — Meownii`;
  if (window.matchMedia('(max-width: 590px)').matches) {
    document.querySelector('#top').scrollIntoView({behavior: 'smooth', block: 'start'});
  }
}
navLinks.forEach(link => link.addEventListener('click', () => showPage(link.dataset.section)));
document.querySelectorAll('[data-go]').forEach(link => link.addEventListener('click', () => showPage(link.dataset.go)));
document.querySelectorAll('[data-home]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault(); showPage('home'); window.scrollTo({top: 0, behavior: 'smooth'});
}));

const audio = document.querySelector('#siteAudio');
const deck = document.querySelector('.music-deck');
const playButton = document.querySelector('#playButton');
const pauseButton = document.querySelector('#pauseButton');
const repeatButton = document.querySelector('#repeatButton');
const volumeControl = document.querySelector('#volumeControl');
const progressControl = document.querySelector('#progressControl');
const trackTitle = document.querySelector('#trackTitle');
const trackHint = document.querySelector('#trackHint');
const audioMessage = document.querySelector('#audioMessage');
const timeReadout = document.querySelector('#timeReadout');
audio.src = 'assets/music.mp3';
audio.volume = Number(volumeControl.value);
audio.loop = true;
function formatTime(value) {
  if (!Number.isFinite(value)) return '--:--';
  const mins = Math.floor(value / 60).toString().padStart(2, '0');
  const secs = Math.floor(value % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}
function setAudioReady() {
  deck.classList.add('has-audio');
  playButton.disabled = pauseButton.disabled = repeatButton.disabled = false;
  progressControl.disabled = false;
  trackTitle.textContent = audio.dataset.trackTitle || 'music.mp3';
  trackHint.textContent = 'Ready when you are';
  audioMessage.textContent = 'Music will keep playing as you browse.';
  timeReadout.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
}
function updateProgress() {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  progressControl.value = String(Math.round((audio.currentTime / audio.duration) * 1000));
  timeReadout.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
}
audio.addEventListener('loadedmetadata', setAudioReady);
audio.addEventListener('canplay', setAudioReady);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', () => { if (audio.loop) audio.currentTime = 0; });
audio.addEventListener('error', () => {
  deck.classList.remove('has-audio');
  playButton.disabled = pauseButton.disabled = repeatButton.disabled = true;
  progressControl.disabled = true;
  trackTitle.textContent = 'No music added yet';
  trackHint.innerHTML = 'Add an MP3 at <code>assets/music.mp3</code>';
  audioMessage.textContent = 'The player is ready; a track has not been added.';
});
playButton.addEventListener('click', async () => {
  try { await audio.play(); audioMessage.textContent = 'Playing'; }
  catch { audioMessage.textContent = 'Could not play this MP3. Check the file format.'; }
});
pauseButton.addEventListener('click', () => { audio.pause(); audioMessage.textContent = 'Paused'; });
repeatButton.addEventListener('click', () => {
  audio.loop = !audio.loop;
  repeatButton.setAttribute('aria-pressed', String(audio.loop));
  audioMessage.textContent = audio.loop ? 'Repeat is on' : 'Repeat is off';
});
volumeControl.addEventListener('input', () => { audio.volume = Number(volumeControl.value); });
progressControl.addEventListener('input', () => {
  if (Number.isFinite(audio.duration)) audio.currentTime = audio.duration * Number(progressControl.value) / 1000;
});
audio.load();

const scene = document.querySelector('[data-parallax]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (scene && !prefersReducedMotion.matches && window.matchMedia('(pointer:fine)').matches) {
  scene.addEventListener('pointermove', event => {
    const bounds = scene.getBoundingClientRect();
    const offset = ((event.clientX - bounds.left) / bounds.width - .5) * 13;
    scene.style.setProperty('--shift', `${offset}px`);
  });
  scene.addEventListener('pointerleave', () => scene.style.setProperty('--shift', '0px'));
}

document.querySelector('#replayWelcome').addEventListener('click', () => {
  const welcome = document.querySelector('.home-intro');
  if (document.querySelector('[data-page="home"]').hidden) showPage('home');
  welcome.classList.remove('replay-note');
  requestAnimationFrame(() => welcome.classList.add('replay-note'));
  welcome.scrollIntoView({behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'center'});
  window.setTimeout(() => welcome.classList.remove('replay-note'), 1100);
});
