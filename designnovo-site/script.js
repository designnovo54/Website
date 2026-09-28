const characterStage = document.querySelector("#characterStage");
const character = document.querySelector("#character");
const cursorGlow = document.querySelector(".cursor-glow");

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

/* =========================================================
   DESIGN NOVO — CHARACTER MOTION SYSTEM
   One character. Side entrances. No content overlap.
   ========================================================= */

let currentSection = -1;
let isMoving = false;

/*
  Each section gets its own side.
  The character alternates sides so it feels like
  the character is travelling through the website.
*/
const sectionConfig = [
  { name: "hero", side: "right", wave: false },
  { name: "statement", side: "left", wave: true },
  { name: "services", side: "right", wave: true },
  { name: "about", side: "left", wave: true },
  { name: "why", side: "right", wave: true },
  { name: "showcase", side: "left", wave: true },
  { name: "partner", side: "right", wave: true },
  { name: "contact", side: "left", wave: true }
];

const sections = [
  ...document.querySelectorAll("[data-section]")
];

/* ---------------------------------------------------------
   HERO INTRO
   Close-up first → smooth zoom out → full body
   --------------------------------------------------------- */

window.addEventListener("load", () => {
  if (!characterStage) return;

  characterStage.classList.add("ready");
  characterStage.classList.add("hero-character");

  setTimeout(() => {
    characterStage.classList.add("hero-reveal");

    setTimeout(() => {
      characterStage.classList.remove("hero-character");
      characterStage.classList.remove("hero-reveal");
    }, 1800);

  }, 150);
});


/* ---------------------------------------------------------
   CREATE SIDE CHARACTER LANE
   The character gets a dedicated visual area so it doesn't
   sit on top of headings, cards or forms.
   --------------------------------------------------------- */

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


/* ---------------------------------------------------------
   MOVE CHARACTER INTO ACTIVE SECTION
   --------------------------------------------------------- */

function moveCharacterToSection(index) {
  if (!characterStage || !sections[index]) return;
  if (currentSection === index) return;

  currentSection = index;
  isMoving = true;

  const section = sections[index];
  const config = sectionConfig[index] || {
    side: index % 2 === 0 ? "right" : "left",
    wave: true
  };

  const lane = createCharacterLane(section);

  /*
    Move the SAME character element into the section.
    There is never a second character.
  */
  lane.appendChild(characterStage);

  characterStage.classList.remove(
    "character-left",
    "character-right",
    "walking-in",
    "arrived",
    "wave-mode",
    "click-mode"
  );

  characterStage.classList.add(
    config.side === "left"
      ? "character-left"
      : "character-right"
  );

  /*
    Force the entrance animation to restart.
  */
  void characterStage.offsetWidth;

  characterStage.classList.add("walking-in");

  setTimeout(() => {
    characterStage.classList.remove("walking-in");
    characterStage.classList.add("arrived");

    if (config.wave) {
      setTimeout(() => {
        characterStage.classList.add("wave-mode");

        setTimeout(() => {
          characterStage.classList.remove("wave-mode");
        }, 1200);

      }, 120);
    }

    isMoving = false;

  }, 850);
}


/* ---------------------------------------------------------
   SECTION DETECTION
   The character changes position when a new section becomes
   the dominant section on screen.
   --------------------------------------------------------- */

const sectionObserver = new IntersectionObserver(
  entries => {

    let bestEntry = null;

    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      if (
        !bestEntry ||
        entry.intersectionRatio > bestEntry.intersectionRatio
      ) {
        bestEntry = entry;
      }
    });

    if (!bestEntry) return;

    const index = sections.indexOf(bestEntry.target);

    if (index !== -1) {
      moveCharacterToSection(index);
    }
  },
  {
    threshold: [0.2, 0.35, 0.5, 0.65],
    rootMargin: "-10% 0px -20% 0px"
  }
);

sections.forEach(section => {
  sectionObserver.observe(section);
});


/* ---------------------------------------------------------
   FALLBACK SCROLL CHECK
   Makes section switching reliable on different screen sizes.
   --------------------------------------------------------- */

function checkActiveSection() {
  if (!sections.length) return;

  const viewportPoint = window.innerHeight * 0.42;

  let closestIndex = 0;
  let closestDistance = Infinity;

  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();

    const sectionCenter =
      rect.top + rect.height / 2;

    const distance =
      Math.abs(sectionCenter - viewportPoint);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  if (closestDistance < window.innerHeight * 0.65) {
    moveCharacterToSection(closestIndex);
  }
}

let scrollTick = false;

window.addEventListener(
  "scroll",
  () => {

    if (scrollTick) return;

    scrollTick = true;

    requestAnimationFrame(() => {
      checkActiveSection();
      scrollTick = false;
    });

  },
  { passive: true }
);

window.addEventListener(
  "resize",
  () => {
    checkActiveSection();
  },
  { passive: true }
);


/* ---------------------------------------------------------
   CHARACTER BODY MOTION
   Small natural movement while standing.
   --------------------------------------------------------- */

let motionFrame = null;

function characterIdleMotion(time) {

  if (!character || !characterStage) {
    motionFrame = requestAnimationFrame(characterIdleMotion);
    return;
  }

  if (!isMoving && characterStage.classList.contains("arrived")) {

    const floatY =
      Math.sin(time * 0.0018) * 2;

    const floatRotate =
      Math.sin(time * 0.0012) * 0.35;

    character.style.transform =
      `translateY(${floatY}px) rotateY(${floatRotate}deg)`;

  }

  motionFrame =
    requestAnimationFrame(characterIdleMotion);
}

motionFrame =
  requestAnimationFrame(characterIdleMotion);


/* ---------------------------------------------------------
   CURSOR GLOW
   --------------------------------------------------------- */

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


/* ---------------------------------------------------------
   SERVICE CARD 3D TILT
   --------------------------------------------------------- */

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


/* ---------------------------------------------------------
   REVEAL ANIMATIONS
   --------------------------------------------------------- */

const reveals =
  [...document.querySelectorAll(".reveal")];

const revealObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }

      });

    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -7% 0px"
    }
  );

reveals.forEach(el => {
  revealObserver.observe(el);
});


/* ---------------------------------------------------------
   CONTACT FORM
   --------------------------------------------------------- */

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

      setTimeout(
        () => {
          toast.classList.remove("show");
        },
        3500
      );

    }
  );

}


/* ---------------------------------------------------------
   INTERACTION SAFETY
   Character never blocks buttons/forms.
   --------------------------------------------------------- */

if (characterStage) {

  characterStage.style.pointerEvents = "none";

}


/* ---------------------------------------------------------
   INITIAL SECTION
   --------------------------------------------------------- */

setTimeout(() => {
  checkActiveSection();
}, 1000);
