const characterStage = document.querySelector("#characterStage");
const character = document.querySelector("#character");
const cursorGlow = document.querySelector(".cursor-glow");

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// The character has a cinematic entrance, then follows a hand-authored path.
// This makes the figure feel like a participant in the story rather than a static mascot.
let introDone = false;
window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    characterStage.classList.add("ready", "hero-zoom");
    setTimeout(() => characterStage.classList.remove("hero-zoom"), 1600);
  });
});

function updateCharacter(){
  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll ? scrollY / maxScroll : 0;

  // x/y are viewport percentages. scale controls the cinematic size at each beat.
  // The first beat deliberately places the character in the middle of the hero copy.
  const path = [
    {p:0.00, x:52, y:53, s:1.26, r:0},
    {p:0.08, x:61, y:52, s:1.04, r:4},
    {p:0.18, x:78, y:49, s:.76, r:8},
    {p:0.31, x:30, y:54, s:.70, r:-9},
    {p:0.45, x:71, y:49, s:.82, r:9},
    {p:0.60, x:54, y:57, s:.66, r:-4},
    {p:0.74, x:26, y:50, s:.82, r:-10},
    {p:0.87, x:72, y:55, s:.72, r:8},
    {p:1.00, x:51, y:53, s:.94, r:0}
  ];

  let a = path[0], b = path[path.length-1];
  for(let i=0;i<path.length-1;i++){
    if(progress >= path[i].p && progress <= path[i+1].p){ a=path[i]; b=path[i+1]; break; }
  }
  const t = b.p === a.p ? 0 : (progress-a.p)/(b.p-a.p);
  const ease = t*t*(3-2*t);
  const x = a.x + (b.x-a.x)*ease;
  const y = a.y + (b.y-a.y)*ease;
  const scale = a.s + (b.s-a.s)*ease;
  const rotate = a.r + (b.r-a.r)*ease;

  characterStage.style.left = `${x}%`;
  characterStage.style.top = `${y}%`;
  characterStage.style.transform = `translate(-50%,-50%) scale(${scale})`;
  character.style.transform = `translateY(${Math.sin(scrollY*.008)*2}px) rotateY(${rotate}deg)`;

  // Hero -> wave beat -> CTA/click beat.
  const wave = progress > .085 && progress < .22;
  const click = progress > .78 && progress < .95;
  characterStage.classList.toggle("wave-mode", wave);
  characterStage.classList.toggle("click-mode", click);

  if(progress > .03) characterStage.classList.add("ready");
}

updateCharacter();
window.addEventListener("scroll", updateCharacter, {passive:true});
window.addEventListener("resize", updateCharacter);

const reveals = [...document.querySelectorAll(".reveal")];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
},{threshold:.12, rootMargin:"0px 0px -7% 0px"});
reveals.forEach(el => observer.observe(el));

if(cursorGlow){
  window.addEventListener("pointermove", e => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  }, {passive:true});
}

document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5;
    const y = (e.clientY-r.top)/r.height-.5;
    card.style.transform = `perspective(800px) rotateX(${y*-5}deg) rotateY(${x*6}deg) translateY(-8px)`;
  });
  card.addEventListener("pointerleave", () => card.style.transform = "");
});

const form = document.querySelector("#contactForm");
const toast = document.querySelector("#toast");
form.addEventListener("submit", e => {
  e.preventDefault();
  toast.classList.add("show");
  form.reset();
  setTimeout(()=>toast.classList.remove("show"),3500);
});

// Keep the character readable over the content while making sure it never blocks interaction.
document.querySelectorAll("a,button,input,textarea").forEach(el=>{
  el.addEventListener("mouseenter",()=>characterStage.style.opacity=".92");
  el.addEventListener("mouseleave",()=>characterStage.style.opacity="1");
});
