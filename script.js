const pageNames = {home:"Home",about:"About",commissions:"Commissions",shop:"Shop",terms:"Terms",contact:"Contact",feedback:"Feedback"};

const pageContent = {
  home: [
    '<h1 class="page-title">Home</h1>',
    '<section class="home-hero"><div class="home-hero-copy"><h2>TITLE HERE</h2><p>SUBTITLE HERE</p></div><div class="image-placeholder banner-placeholder">BANNER HERE</div></section>',
    '<div class="home-lower"><p>DESCRIPTION HERE</p><div class="home-shortcuts"><button class="shortcut" type="button" data-go="commissions">Commissions</button><button class="shortcut" type="button" data-go="shop">Shop</button></div></div>'
  ].join(""),
  about: [
    '<h1 class="page-title">About</h1><section class="about-layout"><div class="about-copy"><h2>TITLE HERE</h2><p class="placeholder-copy">INFO INFO INFO</p><p class="placeholder-copy">DESCRIPTION HERE</p></div><div class="image-placeholder about-image">IMAGE HERE</div></section>'
  ].join(""),
  commissions: [
    '<h1 class="page-title">Commissions</h1><div class="commission-intro"><h2>TITLE HERE</h2><div class="image-placeholder commission-example">IMAGE HERE</div></div>',
    '<ul class="service-lines">',
    '<li><span class="service-index" aria-hidden="true"></span><span><span class="service-name">CATEGORY HERE</span><span class="service-description">DESCRIPTION HERE</span></span><span class="service-price">PRICE HERE</span></li>',
    '<li><span class="service-index" aria-hidden="true"></span><span><span class="service-name">CATEGORY HERE</span><span class="service-description">DESCRIPTION HERE</span></span><span class="service-price">PRICE HERE</span></li>',
    '<li><span class="service-index" aria-hidden="true"></span><span><span class="service-name">CATEGORY HERE</span><span class="service-description">DESCRIPTION HERE</span></span><span class="service-price">PRICE HERE</span></li>',
    '</ul>'
  ].join(""),
  shop: [
    '<h1 class="page-title">Shop</h1><div class="shop-intro"><h2>TITLE HERE</h2></div><div class="product-list">',
    '<article class="product-row"><div class="image-placeholder product-image">IMAGE HERE</div><div><h2 class="product-name">TITLE HERE</h2><p class="product-desc">DESCRIPTION HERE</p></div><span class="product-price">PRICE HERE</span></article>',
    '<article class="product-row"><div class="image-placeholder product-image">IMAGE HERE</div><div><h2 class="product-name">TITLE HERE</h2><p class="product-desc">DESCRIPTION HERE</p></div><span class="product-price">PRICE HERE</span></article>',
    '<article class="product-row"><div class="image-placeholder product-image">IMAGE HERE</div><div><h2 class="product-name">TITLE HERE</h2><p class="product-desc">DESCRIPTION HERE</p></div><span class="product-price">PRICE HERE</span></article></div>'
  ].join(""),
  terms: [
    '<h1 class="page-title">Terms</h1><div class="terms-list">',
    '<section class="term-line"><h2>TITLE HERE</h2><p>INFO INFO INFO</p></section>',
    '<section class="term-line"><h2>TITLE HERE</h2><p>INFO INFO INFO</p></section>',
    '<section class="term-line"><h2>TITLE HERE</h2><p>INFO INFO INFO</p></section>',
    '<section class="term-line"><h2>TITLE HERE</h2><p>INFO INFO INFO</p></section></div>'
  ].join(""),
  contact: [
    '<h1 class="page-title">Contact</h1><div class="contact-lines">',
    '<div class="contact-line">LINK HERE</div><div class="contact-line">LINK HERE</div>',
    '<div class="contact-line">LINK HERE</div><div class="contact-line">LINK HERE</div></div>'
  ].join(""),
  feedback: [
    '<h1 class="page-title">Feedback</h1><p class="feedback-intro">INFO INFO INFO</p><div class="feedback-lines">',
    '<div class="feedback-line"><div class="image-placeholder feedback-image">IMAGE HERE</div><p>TITLE HERE<br>INFO INFO INFO</p></div>',
    '<div class="feedback-line"><div class="image-placeholder feedback-image">IMAGE HERE</div><p>TITLE HERE<br>INFO INFO INFO</p></div></div>'
  ].join("")
};

const content = document.querySelector("#pageContent");
const currentPage = document.querySelector("#currentPage");
const navButtons = [...document.querySelectorAll(".nav-link")];
let activePage = "home";
let transitionTimer;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function showPage(page, updateHash = true) {
  if (!pageNames[page] || page === activePage) return;
  clearTimeout(transitionTimer);
  content.classList.add("leaving");
  transitionTimer = window.setTimeout(() => {
    activePage = page;
    content.innerHTML = pageContent[page];
    content.classList.remove("leaving");
    content.style.animation = "none";
    requestAnimationFrame(() => { content.style.animation = ""; });
    currentPage.textContent = pageNames[page];
    navButtons.forEach(button => {
      const selected = button.dataset.page === page;
      button.classList.toggle("active", selected);
      if (selected) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    document.title = pageNames[page] + " | SHOP NAME";
    if (updateHash) history.replaceState(null, "", "#" + page);
    window.scrollTo({top:0,behavior:reduceMotion?"instant":"smooth"});
  }, reduceMotion ? 0 : 130);
}

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-page]");
  const shortcut = event.target.closest("[data-go]");
  if (nav) showPage(nav.dataset.page);
  if (shortcut) showPage(shortcut.dataset.go);
  if (event.target.closest("#replayIntro")) openIntro();
});

content.innerHTML = pageContent.home;

const initialPage = location.hash.slice(1);
if (pageNames[initialPage] && initialPage !== "home") {
  content.innerHTML = pageContent[initialPage];
  activePage = initialPage;
  currentPage.textContent = pageNames[initialPage];
  navButtons.forEach(button => {
    const selected = button.dataset.page === initialPage;
    button.classList.toggle("active", selected);
    if (selected) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  document.title = pageNames[initialPage] + " | SHOP NAME";
}

const audio = document.querySelector("#siteAudio");
const player = document.querySelector(".music-player");
const playButton = document.querySelector("#playPause");
const repeatButton = document.querySelector("#repeat");
const volume = document.querySelector("#volume");
const progress = document.querySelector("#progress");
const trackTitle = document.querySelector("#trackTitle");
const trackArtist = document.querySelector("#trackArtist");
audio.src = "assets/music.mp3";
audio.loop = true;
audio.volume = Number(volume.value);

function setPlayerReady(ready) {
  playButton.disabled = !ready;
  repeatButton.disabled = !ready;
  volume.disabled = !ready;
  progress.disabled = !ready;
}
function updateProgress() {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  progress.value = String(Math.round((audio.currentTime / audio.duration) * 1000));
}
audio.addEventListener("loadedmetadata", () => setPlayerReady(true));
audio.addEventListener("canplay", () => setPlayerReady(true));
audio.addEventListener("error", () => {
  setPlayerReady(false);
  player.classList.remove("is-playing");
  playButton.classList.remove("is-playing");
});
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("play", () => {
  player.classList.add("is-playing");
  playButton.classList.add("is-playing");
  playButton.setAttribute("aria-label", "Pause");
});
audio.addEventListener("pause", () => {
  player.classList.remove("is-playing");
  playButton.classList.remove("is-playing");
  playButton.setAttribute("aria-label", "Play");
});
playButton.addEventListener("click", async () => {
  if (audio.paused) {
    try { await audio.play(); } catch { setPlayerReady(false); }
  } else {
    audio.pause();
  }
});
repeatButton.addEventListener("click", () => {
  audio.loop = !audio.loop;
  repeatButton.setAttribute("aria-pressed", String(audio.loop));
});
volume.addEventListener("input", () => { audio.volume = Number(volume.value); });
progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) audio.currentTime = audio.duration * Number(progress.value) / 1000;
});
audio.load();

const introScreen = document.querySelector("#introScreen");
const introDialogue = document.querySelector("#introDialogue");
const introHeading = document.querySelector("#introHeading");
const introLine = document.querySelector("#introLine");
const introSteps = [
  {heading:"WELCOME...",line:"INFO INFO INFO"},
  {heading:"INFO INFO INFO",line:"INFO INFO INFO"},
  {heading:"INFO INFO INFO",line:"INFO INFO INFO"}
];
let introStep = 0;
let introCloseTimer;

function openIntro() {
  clearTimeout(introCloseTimer);
  introStep = 0;
  introScreen.hidden = false;
  introScreen.classList.remove("intro-leaving");
  introScreen.classList.add("intro-visible");
  updateIntro();
}

function updateIntro() {
  const step = introSteps[introStep];
  introHeading.textContent = step.heading;
  introLine.textContent = step.line;
  introDialogue.classList.remove("dialogue-change");
  requestAnimationFrame(() => introDialogue.classList.add("dialogue-change"));
}

function advanceIntro() {
  if (introStep < introSteps.length - 1) {
    introStep += 1;
    updateIntro();
  } else {
    closeIntro();
  }
}

function closeIntro() {
  introScreen.classList.remove("intro-visible");
  introScreen.classList.add("intro-leaving");
  introCloseTimer = window.setTimeout(() => {
    introScreen.hidden = true;
    introScreen.classList.remove("intro-leaving");
  }, reduceMotion ? 0 : 240);
}

document.querySelector("#introAdvance").addEventListener("click", advanceIntro);
document.querySelector("#introSkip").addEventListener("click", closeIntro);
introDialogue.addEventListener("click", event => {
  if (!event.target.closest("button")) advanceIntro();
});
document.addEventListener("keydown", event => {
  if (introScreen.hidden) return;
  if (event.key === "Escape") closeIntro();
  if (event.key === "Enter" && !event.target.closest("button")) advanceIntro();
});

