const overlay = document.querySelector('#introOverlay');
const dialogueText = document.querySelector('#dialogueText');
const lines = ['Welcome to Xeniiye! Take a look around and find something you love.', 'Thanks for stopping by. Have a lovely time browsing!'];
let lineIndex = 0;
let typingTimer;
let isTyping = false;

function typeLine(text) {
  clearInterval(typingTimer);
  dialogueText.textContent = '';
  let position = 0;
  isTyping = true;
  typingTimer = setInterval(() => {
    dialogueText.textContent += text.charAt(position++);
    if (position >= text.length) { clearInterval(typingTimer); isTyping = false; }
  }, 24);
}
function beginIntro() { lineIndex = 0; overlay.hidden = false; typeLine(lines[lineIndex]); }
function finishIntro() { clearInterval(typingTimer); isTyping = false; overlay.hidden = true; }
function advanceIntro() {
  if (isTyping) { clearInterval(typingTimer); dialogueText.textContent = lines[lineIndex]; isTyping = false; return; }
  if (lineIndex < lines.length - 1) { typeLine(lines[++lineIndex]); return; }
  finishIntro();
}
overlay.addEventListener('click', advanceIntro);
overlay.querySelector('#introWindow').addEventListener('click', event => {
  if (event.target.closest('button')) return;
  advanceIntro();
});
document.querySelector('#skipIntro').addEventListener('click', event => { event.stopPropagation(); finishIntro(); });
document.querySelector('#advanceDialogue').addEventListener('click', event => { event.stopPropagation(); advanceIntro(); });
document.querySelector('#replayIntro').addEventListener('click', beginIntro);

const pageNames = {
  home: 'WELCOME TO XENIIYE', about: 'MEET THE CREATOR', commissions: 'COMMISSION DESK',
  shop: 'BROWSE THE SHOP', tos: 'TERMS OF SERVICE', contact: 'GET IN TOUCH', feedback: 'FEEDBACK WALL'
};
const navItems = [...document.querySelectorAll('.nav-button[data-section]')];
const pages = [...document.querySelectorAll('.page-content[data-page]')];
const pagePath = document.querySelector('#pagePath');
function showPage(name) {
  pages.forEach(page => {
    const current = page.dataset.page === name;
    page.classList.toggle('is-visible', current);
    page.hidden = !current;
  });
  navItems.forEach(button => {
    const current = button.dataset.section === name;
    button.classList.toggle('is-active', current);
    if (current) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  pagePath.textContent = pageNames[name];
  document.title = `${name === 'home' ? 'Xeniiye' : name[0].toUpperCase() + name.slice(1)} — Creative Shop`;
}
navItems.forEach(button => button.addEventListener('click', () => showPage(button.dataset.section)));
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showPage(button.dataset.go)));
document.querySelectorAll('[data-home]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); showPage('home'); window.scrollTo({top:0,behavior:'smooth'}); }));
