const characterStage = document.querySelector("#characterStage");
const character = document.querySelector("#character");
const cursorGlow = document.querySelector(".cursor-glow");

const sections = [...document.querySelectorAll("[data-section]")];

let currentSection = -1;
let isMoving = false;

const sectionConfig = [
  { name: "hero", side: "right", wave: false },
  { name: "statement", side: "right", enter: "left", wave: true },
  { name: "services", side: "right", enter: "right", wave: true },
  { name: "about", side: "right", enter: "left", wave: true },
  { name: "why", side: "right", enter: "right", wave: true },
  { name: "showcase", side: "right", enter: "left", wave: true },
  { name: "partner", side: "right", enter: "right", wave: true },
  { name: "contact", side: "right", enter: "left", wave: true }
];

function createCharacterLane(section) {
  let lane = section.querySelector(".character-lane");

  if (!lane) {
    lane = document.createElement("div");
    lane.className = "character-lane";
    lane.setAttribute("aria-hidden", "true");
    section.appendChild(lane);
  }

  return lane;
}

function clearCharacterModes() {
  if (!characterStage) return;

  characterStage.classList.remove(
    "hero-character",
    "hero-reveal",
    "character-left",
    "character-right",
    "walking-in",
    "arrived",
    "wave-mode",
    "click-mode"
  );
}

function showHero() {
  if (!characterStage) return;

  const hero = sections[0];

  if (!hero) return;

  const lane = createCharacterLane(hero);

  lane.classList.remove("lane-left", "lane-right");
  lane.classList.add("lane-right");

  lane.appendChild(characterStage);

  clearCharacterModes();

  characterStage.classList.add("ready", "hero-character");

  void characterStage.offsetWidth;

  characterStage.classList.add("hero-reveal");

  currentSection = 0;
  isMoving = false;
}

function moveCharacterToSection(index) {
  if (!characterStage || !sections[index] || index === 0) return;

  if (currentSection === index) return;

  currentSection = index;
  isMoving = true;

  const section = sections[index];
  const config = sectionConfig[index] || {
    side: "right",
    wave: true
  };

  const lane = createCharacterLane(section);

  lane.classList.remove("lane-left", "lane-right");
  lane.classList.add("lane-right");

  lane.appendChild(characterStage);

  clearCharacterModes();

  characterStage.classList.add(
    "ready",
    "character-right"
  );

  characterStage.classList.add(
    config.enter === "left"
      ? "walk-enter-left"
      : "walk-enter-right"
  );

  void characterStage.offsetWidth;

  characterStage.classList.add("walking-in");

  setTimeout(() => {

    characterStage.classList.remove(
      "walking-in",
      "walk-enter-left",
      "walk-enter-right"
    );

    characterStage.classList.add("arrived");

    if (config.wave) {

      setTimeout(() => {

        if (currentSection !== index) return;

        characterStage.classList.add("wave-mode");

        setTimeout(() => {
          characterStage.classList.remove("wave-mode");
        }, 1500);

      }, 160);
    }

    isMoving = false;

  }, 900);
}

function getClosestSection() {

  if (!sections.length) return 0;

  const viewportPoint = window.innerHeight * 0.42;

  let closestIndex = 0;
  let closestDistance = Infinity;

  sections.forEach((section, index) => {

    const rect = section.getBoundingClientRect();

    const center =
      rect.top + rect.height / 2;

    const distance =
      Math.abs(center - viewportPoint);

    if (distance < closestDistance) {

      closestDistance = distance;
      closestIndex = index;

    }

  });

  return closestIndex;
}

const sectionObserver =
  new IntersectionObserver(entries => {

    let bestEntry = null;

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      if (
        !bestEntry ||
        entry.intersectionRatio >
        bestEntry.intersectionRatio
      ) {
        bestEntry = entry;
      }

    });

    if (!bestEntry) return;

    const index =
      sections.indexOf(bestEntry.target);

    if (index === 0) {

      showHero();

    } else if (index > 0) {

      moveCharacterToSection(index);

    }

  }, {

    threshold: [
      0.2,
      0.35,
      0.5,
      0.65
    ],

    rootMargin:
      "-10% 0px -20% 0px"

  });

sections.forEach(section => {
  sectionObserver.observe(section);
});

let scrollTick = false;

window.addEventListener(
  "scroll",
  () => {

    if (scrollTick) return;

    scrollTick = true;

    requestAnimationFrame(() => {

      const index =
        getClosestSection();

      if (index === 0) {

        if (currentSection !== 0) {
          showHero();
        }

      } else {

        moveCharacterToSection(index);

      }

      scrollTick = false;

    });

  },
  { passive: true }
);

window.addEventListener(
  "resize",
  () => {

    const index =
      getClosestSection();

    if (index === 0) {

      showHero();

    } else {

      moveCharacterToSection(index);

    }

  },
  { passive: true }
);

if (characterStage) {

  characterStage.style.pointerEvents =
    "none";

}

if (cursorGlow) {

  window.addEventListener(
    "pointermove",
    e => {

      cursorGlow.style.left =
        `${e.clientX}px`;

      cursorGlow.style.top =
        `${e.clientY}px`;

    },
    { passive: true }
  );

}


/* -----------------------------------------
   SERVICE CARD TILT
----------------------------------------- */

document
  .querySelectorAll(".service-card")
  .forEach(card => {

    card.addEventListener(
      "pointermove",
      e => {

        const rect =
          card.getBoundingClientRect();

        const x =
          (e.clientX - rect.left) /
          rect.width - 0.5;

        const y =
          (e.clientY - rect.top) /
          rect.height - 0.5;

        card.style.transform =
          `perspective(800px)
           rotateX(${y * -5}deg)
           rotateY(${x * 6}deg)
           translateY(-8px)`;

      }
    );

    card.addEventListener(
      "pointerleave",
      () => {

        card.style.transform = "";

      }
    );

  });


/* -----------------------------------------
   GENERAL REVEAL ANIMATIONS
----------------------------------------- */

const reveals =
  [...document.querySelectorAll(".reveal")];

const revealObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            "visible"
          );

        }

      });

    },
    {
      threshold: 0.12,
      rootMargin:
        "0px 0px -7% 0px"
    }
  );

reveals.forEach(el => {

  revealObserver.observe(el);

});


/* -----------------------------------------
   CONTACT FORM
----------------------------------------- */

const form =
  document.querySelector("#contactForm");

const toast =
  document.querySelector("#toast");

if (form && toast) {

  form.addEventListener(
    "submit",
    e => {

      e.preventDefault();

      toast.classList.add("show");

      form.reset();

      setTimeout(() => {

        toast.classList.remove("show");

      }, 3500);

    }
  );

}


/* -----------------------------------------
   INITIAL CHARACTER STATE
----------------------------------------- */

window.addEventListener(
  "load",
  () => {

    setTimeout(() => {

      const index =
        getClosestSection();

      if (index === 0) {

        showHero();

      } else {

        moveCharacterToSection(index);

      }

    }, 250);

  }
);
