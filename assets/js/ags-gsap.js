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
    start: "top 60%", // When top of hero-section hits 80% of viewport height
    toggleActions: "play none none none", // Play only once, don't reset
  },
});

/********** Hero Animation Timeline **********/
const heroTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero-title",
    start: "top 60%",
    once: true, // play only once
  },
});

// Hero Title Animation
heroTimeline.from(
  [".hero-title-top", ".hero-title-middle", ".hero-title-bottom"],
  {
    y: "100%", // slide upward
    duration: 1,
    ease: "power3.out",
    stagger: 0.2, // delay between each line
  }
);

// Hero Sub Content Animation (runs automatically after title animation)
heroTimeline.from(
  [".hero-description", ".link-wrapper", ".detail-wrapper"],
  {
    y: "100%",
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    stagger: 0.1,
  },
  ">"
); // ">" = start right after previous animation finishes

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

/********** Service Section Animation **********/
const serviceTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".services",
    start: "top 80%",
    once: true,
  },
});

// Animate title lines first
serviceTimeline.fromTo(
  [".service-title-top", ".service-title-middle", ".service-title-bottom"],
  { y: "100%" },
  {
    y: "0%",
    duration: 0.5,
    ease: "power3.out",
    stagger: 0.1,
  }
);

// Animate description AFTER titles finish
serviceTimeline.fromTo(
  ".service-title-description",
  { y: "100%", opacity: 0 },
  {
    y: "0%",
    opacity: 1,
    duration: 0.25,
    ease: "power3.out",
  },
  ">" // waits until title finishes
);

// Animate cards AFTER description finishes
serviceTimeline.to(
  ".service-card",
  {
    y: 0,
    opacity: 1,
    duration: 0.75,
    ease: "power3.out",
    stagger: {
      each: 0.25, // one after another
    },
  },
  ">" // wait until description finishes
);

/********** Animate method section title **********/
gsap.fromTo(
  [".method-title-top", ".method-title-bottom"],
  { y: "100%" }, // start below
  {
    y: "0%",
    duration: 0.5,
    ease: "power3.out",
    stagger: 0.25,
    scrollTrigger: {
      trigger: ".method-section",
      start: "top 80%",
      once: true,
    },
  }
);

/********** Workflow Timeline **********/
const workflowTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".workflow-title", // wrapper for title + subtitle + cards
    start: "top 80%",
    once: true, // run only once
  },
});

/********** Workflow Title Animation **********/
workflowTimeline.from([".workflow-title-top", ".workflow-title-bottom"], {
  y: "100%",
  opacity: 0,
  duration: 0.5,
  ease: "power3.out",
  stagger: 0.1, // delay between top and bottom
});

/********** Workflow Subtitle Animation **********/
workflowTimeline.from(
  ".workflow-subtitle-wrapper",
  {
    y: 50,
    opacity: 0,
    duration: 0.5,
    ease: "power3.out",
  },
  ">" // start after title completes
);

/********** Workflow Cards Animation **********/
workflowTimeline.from(
  ".workflow-card",
  {
    y: 80,
    opacity: 0,
    duration: 0.75,
    ease: "power3.out",
    stagger: {
      each: 0.2, // one by one
    },
  },
  ">" // start after subtitle completes
);

/********** Testimonial Section Animation **********/
const testimonialTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".testimonial-title", // wrapper for title + subtitle
    start: "top 80%",
    once: true,
  },
});

// Animate title lines first
testimonialTimeline.from(
  [".testimonial-title-top", ".testimonial-title-bottom"],
  {
    y: "100%",
    opacity: 0,
    duration: 0.5,
    ease: "power3.out",
    stagger: 0.2, // delay between top & bottom
  }
);

// Animate subtitle AFTER title
testimonialTimeline.from(
  [".testi-subtitle-top", ".testi-subtitle-bottom"],
  {
    y: "100%",
    opacity: 0,
    duration: 0.75,
    ease: "power3.out",
    stagger: 0.2,
  },
  ">" // start after title finishes
);

/********** Animate filters **********/
testimonialTimeline.from(
  ".filters",
  {
    opacity: 0,
    scale: 0.8,
    duration: 0.5,
    ease: "power3.out",
  },
  ">" // starts right after title animation completes
);

/********** Animate grid-wrapper **********/
testimonialTimeline.from(
  ".grid-wrapper",
  {
    opacity: 0,
    scale: 0.85,
    duration: 1.25,
    ease: "power3.out",
  },
  ">" // starts after filters animation completes
);

/********** Comparison Section Animation **********/
/********** Animate comparison section **********/
const comparisonTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".comparison-block", // whole block (title + rows)
    start: "top 80%",
    once: true,
  },
});

// 1️⃣ Animate title lines
comparisonTimeline.from([".comparison-title-top", ".comparison-title-bottom"], {
  y: "100%",
  opacity: 0,
  duration: 0.5,
  ease: "power3.out",
  stagger: 0.25,
});

// 2️⃣ Animate subtitle AFTER title
comparisonTimeline.from(
  ".comparison-subtitle",
  {
    y: "100%",
    opacity: 0,
    duration: 0.5,
    ease: "power3.out",
  },
  ">" // after previous finishes
);

// 3️⃣ Animate rows one by one
const rows = gsap.utils.toArray(".comparison-row");

rows.forEach((row) => {
  comparisonTimeline.from(
    row,
    {
      x: -80,
      opacity: 0,
      duration: 0.25,
      ease: "power3.out",
    },
    ">" // chain sequentially (one after the other)
  );
});

/********** Animate FAQ section **********/
const faqTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".faq-title",
    start: "top 80%",
    once: true,
  },
});

// Animate FAQ title
faqTimeline.fromTo(
  ".faq-title-top",
  { y: "100%", opacity: 0 },
  {
    y: "0%",
    opacity: 1,
    duration: 0.5,
    ease: "power3.out",
  }
);

// Animate FAQ subtitle AFTER title
faqTimeline.fromTo(
  ".faq-subtitle",
  { y: "100%", opacity: 0 },
  {
    y: "0%",
    opacity: 1,
    duration: 0.5,
    ease: "power3.out",
  },
  ">" // start after title finishes
);

// 🔑 Animate accordion items (fade in only)
faqTimeline.to(
  ".accordion-item",
  {
    opacity: 1, // ✅ ensure it goes to fully visible
    duration: 0.75,
    ease: "power4.out",
    stagger: 0.25, // one by one
  },
  ">" // after subtitle
);

/********** Animate Footer section **********/
const footerTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".footer-title",
    start: "top 80%",
    once: true,
  },
});

// Animate footer title lines
footerTimeline.fromTo(
  [".footer-title-top", ".footer-title-bottom"],
  { y: "100%", opacity: 0 },
  {
    y: "0%",
    opacity: 1,
    duration: 0.5,
    ease: "power3.out",
    stagger: 0.2,
  }
);

// Animate subtitle AFTER title
footerTimeline.fromTo(
  ".footer-subtitle",
  { y: "100%", opacity: 0 },
  {
    y: "0%",
    opacity: 1,
    duration: 0.5,
    ease: "power3.out",
  },
  ">" // start after title finishes
);

// Animate CTA AFTER subtitle
footerTimeline.fromTo(
  ".footer-cta-btn",
  { opacity: 0, scale: 0.9 },
  {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: "back.out(0.75)",
  },
  ">" // start after subtitle
);
