const overlay = document.querySelector('#introOverlay');
const dialogueText = document.querySelector('#dialogueText');
const lines = ['DIALOGUE TEXT GOES HERE', 'NEXT DIALOGUE LINE GOES HERE'];
let lineIndex = 0;
let typingTimer;
let isTyping = false;

function typeLine(text) {
  clearInterval(typingTimer);
  dialogueText.textContent = '';
  let position = 0;
  isTyping = true;
  typingTimer = setInterval(() => {
    dialogueText.textContent += text.charAt(position);
    position += 1;
    if (position >= text.length) {
      clearInterval(typingTimer);
      isTyping = false;
    }
  }, 28);
}

function beginIntro() {
  lineIndex = 0;
  overlay.hidden = false;
  typeLine(lines[lineIndex]);
}

function finishIntro() {
  clearInterval(typingTimer);
  isTyping = false;
  overlay.hidden = true;
}

function advanceIntro() {
  if (isTyping) {
    clearInterval(typingTimer);
    dialogueText.textContent = lines[lineIndex];
    isTyping = false;
    return;
  }
  if (lineIndex < lines.length - 1) {
    lineIndex += 1;
    typeLine(lines[lineIndex]);
    return;
  }
  finishIntro();
}

overlay.addEventListener('click', advanceIntro);
overlay.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    advanceIntro();
  }
});
document.querySelector('#skipIntro').addEventListener('click', event => {
  event.stopPropagation();
  finishIntro();
});
document.querySelector('#replayIntro').addEventListener('click', beginIntro);

const pageNames = {
  home: 'HOME / MAIN PAGE',
  about: 'ABOUT ME / PROFILE FILE',
  commissions: 'COMMISSIONS / SERVICE MENU',
  shop: 'SHOP / CATALOGUE',
  tos: 'TERMS OF SERVICE / HELP FILE',
  contact: 'CONTACT / MESSAGE CENTER',
  feedback: 'FEEDBACK / MESSAGE WINDOW'
};
const navItems = [...document.querySelectorAll('.dock-item[data-section]')];
const pages = [...document.querySelectorAll('.page-content[data-page]')];
const pagePath = document.querySelector('#pagePath');
const footerPath = document.querySelector('.site-footer span:nth-child(2)');

function showPage(name) {
  pages.forEach(page => {
    const current = page.dataset.page === name;
    page.classList.toggle('active', current);
    page.hidden = !current;
  });
  navItems.forEach(button => {
    const current = button.dataset.section === name;
    button.classList.toggle('selected', current);
    button.setAttribute('aria-current', current ? 'page' : 'false');
  });
  pagePath.textContent = pageNames[name];
  footerPath.textContent = pageNames[name];
  document.title = `${name.toUpperCase()} — Website Preview`;
}

navItems.forEach(button => button.addEventListener('click', () => showPage(button.dataset.section)));

const player = document.querySelector('.music-console');
document.querySelector('#playToggle').addEventListener('click', event => {
  const paused = player.classList.toggle('paused');
  event.currentTarget.textContent = paused ? '▶' : 'Ⅱ';
  event.currentTarget.setAttribute('aria-label', paused ? 'Resume music preview' : 'Pause music preview');
  document.querySelector('.transport span').textContent = paused ? 'PAUSE' : 'DEMO';
});

// Live analog/digital clock, with a switchable 12-hour and 24-hour readout.
const clockDisplay = document.querySelector('#clockDisplay');
const clockDate = document.querySelector('#clockDate');
const taskbarClock = document.querySelector('#taskbarClock');
const clockFormatToggle = document.querySelector('#clockFormatToggle');
let clockUses12Hours = false;
clockFormatToggle?.addEventListener('click', () => {
  clockUses12Hours = !clockUses12Hours;
  clockFormatToggle.textContent = clockUses12Hours ? '12H' : '24H';
  clockFormatToggle.setAttribute('aria-pressed', String(clockUses12Hours));
  updateClock();
});
function updateClock() {
  const now = new Date();
  const timeOptions = {hour: '2-digit', minute: '2-digit', hour12: clockUses12Hours};
  const timeText = new Intl.DateTimeFormat('en-US', timeOptions).format(now);
  if (clockDisplay) clockDisplay.textContent = timeText;
  if (taskbarClock) taskbarClock.textContent = new Intl.DateTimeFormat('en-US', {hour: '2-digit', minute: '2-digit', hour12: false}).format(now);
  if (clockDate) clockDate.textContent = new Intl.DateTimeFormat('en-US', {weekday: 'short', month: 'short', day: '2-digit'}).format(now).toUpperCase();
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;
  const secondHand = document.querySelector('#clockSecond');
  const minuteHand = document.querySelector('#clockMinute');
  const hourHand = document.querySelector('#clockHour');
  if (secondHand) secondHand.style.transform = `translateX(-50%) rotate(${seconds * 6}deg)`;
  if (minuteHand) minuteHand.style.transform = `translateX(-50%) rotate(${minutes * 6}deg)`;
  if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hours * 30}deg)`;
}
updateClock();
window.setInterval(updateClock, 1000);

