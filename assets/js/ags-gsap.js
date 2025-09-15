/********** GSAP Animations **********/

gsap.registerPlugin(ScrollTrigger);

/********** Animate hero-bg only when hero-section enters the viewport **********/
gsap.from(".hero-bg", {
  x: -100,
  opacity: 0,
  duration: 5,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".hero-section", // Animation triggers when this section is visible
    start: "top 80%", // When top of hero-section hits 80% of viewport height
    toggleActions: "play none none none", // Play only once, don't reset
  },
});

/********** Hero Title Animation **********/
gsap.from([".hero-title-top", ".hero-title-middle", ".hero-title-bottom"], {
  y: "100%", // slide upward
  duration: 1.2,
  ease: "power3.out",
  stagger: 0.25, // ⏱ tiny delay (50ms) between each line
  scrollTrigger: {
    trigger: ".hero-title",
    start: "top 80%",
    once: true,
  },
});

/********** Hero Sub Content Animation **********/
gsap.from([".hero-description", ".link-wrapper", ".detail-wrapper"], {
  y: "100%", // slide upward
  duration: 1.2,
  ease: "power3.out",
  stagger: 0.25, // ⏱ tiny delay (50ms) between each line
  scrollTrigger: {
    trigger: ".hero-sub-content",
    start: "top 80%", // start when hero section is in view
    once: true,
  },
});

/********** Project Section Title Animation **********/
gsap.fromTo(
  [".project-title-top", ".project-title-bottom"],
  { y: "100%" }, // START (offscreen below)
  {
    y: "0%", // END (natural position)
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.05,
    scrollTrigger: {
      trigger: ".project-title",
      start: "top 80%",
      once: true,
    },
  }
);

/********** Animate service section Title **********/
gsap.fromTo(
  [
    ".service-title-top",
    ".service-title-middle",
    ".service-title-bottom, .service-title-description",
  ],
  { y: "100%" }, // start from below
  {
    y: "0%",
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.05,
    scrollTrigger: {
      trigger: ".service-section",
      start: "top 80%",
      once: true,
    },
  }
);

/**********Animate service card **********/
gsap.set(".service-card", { opacity: 1, y: 0 }); // Ensure they are visible by default

gsap.from(".service-card", {
  scrollTrigger: {
    trigger: ".services",
    start: "top 80%",
    once: true, // ✅ run only once
  },
  y: 80,
  opacity: 0,
  duration: 1.5,
  ease: "power3.out",
  stagger: {
    each: 0.5,
  },
});

/********** Animate method section title **********/
gsap.fromTo(
  [".method-title-top", ".method-title-bottom"],
  { y: "100%" }, // start below
  {
    y: "0%",
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.05,
    scrollTrigger: {
      trigger: ".method-section",
      start: "top 80%",
      once: true,
    },
  }
);

/********** Animate workflow title **********/
gsap.fromTo(
  [".workflow-title-top", ".workflow-title-bottom"],
  { y: "100%" }, // start off-screen (below)
  {
    y: "0%",
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.05,
    scrollTrigger: {
      trigger: ".workflow-title",
      start: "top 80%",
      once: true,
    },
  }
);

/********** Animate workflow cards **********/
gsap.from(".workflow-card", {
  scrollTrigger: {
    trigger: ".workflow-cards",
    start: "top 80%", // animation starts when 80% of viewport hits the section
    once: true, // ✅ run only once per page load
  },
  y: 80, // slide up from below
  opacity: 0, // fade in
  duration: 3, // duration for each card
  ease: "power3.out",
  stagger: {
    each: 0.5, // delay between each card start
    overlap: 0.5, // ✅ overlapping animation (50% into previous one)
  },
});

/********** Animate testimonial title **********/
gsap.fromTo(
  [".testimonial-title-top", ".testimonial-title-bottom"],
  { y: "100%" }, // start off-screen (below)
  {
    y: "0%",
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.05,
    scrollTrigger: {
      trigger: ".testimonial-title",
      start: "top 80%",
      once: true,
    },
  }
);

/********** Animate filters **********/
gsap.from(".filters", {
  scrollTrigger: {
    trigger: ".grid-wrapper",
    start: "top 80%", // when grid-wrapper enters viewport
    once: true, // ✅ only animate once
  },
  opacity: 0,
  scale: 0.8, // start slightly smaller
  duration: 3,
  ease: "power3.out",
});

/********** Animate grid-wrapper **********/
gsap.from(".grid-wrapper", {
  scrollTrigger: {
    trigger: ".grid-wrapper",
    start: "top 80%",
    once: true,
  },
  opacity: 0,
  scale: 0.85,
  duration: 3,
  ease: "power3.out",
});

/********** Animate comparison title **********/
gsap.fromTo(
  [".comparison-title-top", ".comparison-title-bottom"],
  { y: "100%" }, // start off-screen (below)
  {
    y: "0%",
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.05,
    scrollTrigger: {
      trigger: ".comparison-title",
      start: "top 80%",
      once: true,
    },
  }
);

/********** Animate comparison table **********/
const rows = gsap.utils.toArray(".comparison-row");

gsap.from(rows, {
  scrollTrigger: {
    trigger: ".comparison-block",
    start: "top 80%", // Trigger when comparison block is ~80% visible
    toggleActions: "play none none none", // play only once
    once: true, // ✅ ensures animation happens only once per page load
  },
  x: -80, // slide from left
  opacity: 0,
  duration: 1.2,
  ease: "power3.out",
  stagger: {
    each: 0.6, // delay between rows
    amount: 1.2, // controls total stagger timing
    from: "start",
  },
});

/********** Animate faq title **********/
gsap.fromTo(
  [".faq-title-top"],
  { y: "100%" }, // start off-screen (below)
  {
    y: "0%",
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.05,
    scrollTrigger: {
      trigger: ".faq-title",
      start: "top 80%",
      once: true,
    },
  }
);

/********** Animate accordion items when reaching the section **********/
gsap.set(".accordion-item", { opacity: 1 });

// ✅ Then animate them from hidden state when triggered
gsap.from(".accordion-item", {
  opacity: 0,
  y: 50,
  duration: 1.2,
  ease: "power4.out",
  stagger: 0.25,
  scrollTrigger: {
    trigger: ".accordion",
    start: "top 80%",
    once: true, // ✅ ensures it runs only once, doesn't reset opacity
  },
});

/********** Animate footer top **********/
gsap.fromTo(
  [".footer-title-top", ".footer-title-bottom"],
  { y: "100%" }, // start off-screen (below)
  {
    y: "0%",
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.05,
    scrollTrigger: {
      trigger: ".footer-title",
      start: "top 80%",
      once: true,
    },
  }
);

/****************** Project cards reveals animation *********************/

const cards = gsap.utils.toArray(".project-card");
let gap = 30; // gap between stacked cards

if (window.innerWidth < 576) {
  gap = 20;
} else if (window.innerWidth >= 1200) {
  gap = 30;
}

const revealDuration = 1;

// ✅ Setup initial positions & visibility
cards.forEach((card, i) => {
  const cardHeight = card.offsetHeight;

  gsap.set(card, {
    y: i === 0 ? 0 : i * (cardHeight + gap), // place other cards below
    scaleX: 1,
    autoAlpha: i === 0 ? 1 : 0, // 👈 only first card visible
    zIndex: i + 1, // reversed stacking order
  });
});

// ✅ Scroll animation timeline
// Determine start value based on screen width
let startValue = "top 10%"; // default

if (window.innerWidth < 576) {
  startValue = "top 20%"; // smaller screens
} else if (window.innerWidth >= 1200) {
  startValue = "top 5%"; // large screens
}

// Create GSAP timeline
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".project-container",
    start: startValue,
    end: `+=${cards.length * 300}`,
    scrub: true,
    pin: true,
  },
});

cards.forEach((card, i) => {
  if (i === 0) return;

  const previousCard = cards[i - 1];

  // Reveal and slide current card
  tl.to(
    card,
    {
      autoAlpha: 1, // make visible
      y: i * gap, // slide upward to stack with gap
      duration: revealDuration,
      ease: "power3.out",
    },
    i
  );

  // Shrink previous card progressively and center it
  const shrinkMap = [80, 60, 40, 20, 0]; // shrink values in px
  const shrinkValue = shrinkMap[i - 1] || 0; // default 0 if no mapping

  tl.to(
    previousCard,
    {
      width: `calc(100% - ${shrinkValue}px)`,
      left: "50%",
      xPercent: -50, // center horizontally
      duration: 1,
      ease: "power2.out",
    },
    i
  );
});
