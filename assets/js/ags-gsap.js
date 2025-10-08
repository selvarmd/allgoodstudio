/********** GSAP Animations **********/
gsap.registerPlugin(ScrollTrigger);

/********** Run animations only for screens ≥ 992px **********/
ScrollTrigger.matchMedia({

  // Desktop only
  "(min-width: 768px)": function () {

    /********** Animate hero-bg only when hero-section enters the viewport **********/
    gsap.from(".hero-bg", {
      x: -100,
      opacity: 0,
      duration: 5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top 60%",
        toggleActions: "play none none none",
      },
    });

    /********** Hero Animation Timeline **********/
    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-title",
        start: "top 60%",
        once: true,
      },
    });

    heroTimeline.from(
      [".hero-title-top", ".hero-title-middle", ".hero-title-bottom"],
      {
        y: "100%",
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
      }
    );

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
    );

    /********** Project Section Title Animation **********/
    gsap.fromTo(
      [".project-title-top", ".project-description-top"],
      { y: "100%" },
      {
        y: "0%",
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
        trigger: ".service-section",
        start: "top 60%",
        once: true,
      },
    });

    serviceTimeline.fromTo(
      [".service-title-top", ".service-title-middle", ".service-title-bottom"],
      { y: "100%" },
      {
        y: "0%",
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.05,
      }
    );

    serviceTimeline.fromTo(
      ".service-title-description",
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.1,
        ease: "power3.out",
      },
      ">"
    );

    serviceTimeline.to(
      ".service-card",
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
        stagger: { each: 0.1 },
      },
      ">"
    );

    /********** Animate method section title **********/
    gsap.fromTo(
      [".method-title-top", ".method-title-bottom"],
      { y: "100%" },
      {
        y: "0%",
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: ".method-section",
          start: "top 60%",
          once: true,
        },
      }
    );

    /********** Workflow Timeline **********/
    const workflowTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".workflow-section",
        start: "top 60%",
        once: true,
      },
    });

    workflowTimeline.from([".workflow-title-top", ".workflow-title-bottom"], {
      y: "100%",
      opacity: 0,
      duration: 0.25,
      ease: "power3.out",
      stagger: 0.1,
    });

    workflowTimeline.from(
      ".workflow-subtitle-wrapper",
      {
        y: 50,
        opacity: 0,
        duration: 0.25,
        ease: "power3.out",
      },
      ">"
    );

    workflowTimeline.from(
      ".workflow-card",
      {
        y: 80,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: { each: 0.1 },
      },
      ">"
    );

    document.querySelectorAll(".workflow-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { y: -10, duration: 0.3, ease: "power3.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { y: 0, duration: 0.3, ease: "power3.out" });
      });
    });

    /********** Testimonial Section Animation **********/
    const testimonialTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonial-section",
        start: "top 60%",
        once: true,
      },
    });

    testimonialTimeline.from(
      [".testimonial-title-top", ".testimonial-title-bottom"],
      {
        y: "100%",
        opacity: 0,
        duration: 0.25,
        ease: "power3.out",
        stagger: 0.1,
      }
    );

    testimonialTimeline.from(
      [".testi-subtitle-top", ".testi-subtitle-bottom"],
      {
        y: "100%",
        opacity: 0,
        duration: 0.25,
        ease: "power3.out",
        stagger: 0.1,
      },
      ">"
    );

    testimonialTimeline.from(
      ".filters",
      {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "power3.out",
      },
      ">"
    );

    testimonialTimeline.from(
      ".grid-wrapper",
      {
        opacity: 0,
        scale: 0.85,
        duration: 0.5,
        ease: "power3.out",
      },
      ">"
    );

    /********** Comparison Section Animation **********/
    const comparisonTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".comparison-section",
        start: "top 60%",
        once: true,
      },
    });

    comparisonTimeline.from(
      [".comparison-title-top", ".comparison-title-bottom"],
      {
        y: "100%",
        opacity: 0,
        duration: 0.25,
        ease: "power3.out",
        stagger: 0.1,
      }
    );

    comparisonTimeline.from(
      ".comparison-subtitle",
      {
        y: "100%",
        opacity: 0,
        duration: 0.1,
        ease: "power3.out",
      },
      ">"
    );

    const rows = gsap.utils.toArray(".comparison-row");
    rows.forEach((row) => {
      comparisonTimeline.from(
        row,
        {
          x: -80,
          opacity: 0,
          duration: 0.2,
          ease: "power3.out",
        },
        ">"
      );
    });

    /********** FAQ Section Animation **********/
    const faqTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".faq-title",
        start: "top 60%",
        once: true,
      },
    });

    faqTimeline.fromTo(
      ".faq-title-top",
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.25,
        ease: "power3.out",
      }
    );

    faqTimeline.fromTo(
      ".faq-subtitle",
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.25,
        ease: "power3.out",
      },
      ">"
    );

    faqTimeline.to(
      ".accordion-item",
      {
        opacity: 1,
        duration: 0.5,
        ease: "power4.out",
        stagger: 0.1,
      },
      ">"
    );

    /********** Footer Section Animation **********/
    const footerTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".footer-title",
        start: "top 70%",
        once: true,
      },
    });

    footerTimeline.fromTo(
      [".footer-title-top", ".footer-title-bottom"],
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.1,
      }
    );

    footerTimeline.fromTo(
      ".footer-subtitle",
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.25,
        ease: "power3.out",
      },
      ">"
    );

    footerTimeline.fromTo(
      ".footer-cta-btn",
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.25,
        ease: "back.out(0.75)",
      },
      ">"
    );
  },

  // Optional: disable or clear animations below 992px
  "(max-width: 767px)": function () {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.globalTimeline.clear();
  }
});

/*********** Portfolio vertical stacked scroll (guarded + robust) *************/

const carousel = document.querySelector(".portfolio-carousel");
const items = gsap.utils.toArray(".portfolio-item");

// ✅ Force all except the first item to start at translateY(100%)
gsap.set(items.slice(1), { y: "100%" });

const tl = gsap.timeline({ paused: true });

// 1️⃣ First card stays static
gsap.set(items[0], {
  y: 0,
  scale: 0.8,
  transformOrigin: "top center"
});

// 2️⃣ Animate the rest upward and scale gradually
items.slice(1).forEach((item, i) => {
  const offsetY = (i + 1) * 50;  // each card 50px lower
  const scale = 0.8 + ((i + 1) / (items.length - 1)) * 0.2; // from 0.8 → 1.0

  tl.to(item, {
    y: offsetY,
    scale: scale,
    duration: 1,
    ease: "power2.out",
    transformOrigin: "top center"
  }, i);
});

// 3️⃣ ScrollTrigger drives the timeline
ScrollTrigger.create({
  animation: tl,
  trigger: ".portfolio-section",
  start: "top 10%",
  end: () => "+=" + carousel.offsetHeight,
  scrub: true,
  pin: true,
  anticipatePin: 1,
  invalidateOnRefresh: true
});
