// Header
// window.addEventListener("scroll", function () {
//   const header = document.querySelector("header");
//   if (window.scrollY > 0) {
//     header.classList.add("scrolled");
//   } else {
//     header.classList.remove("scrolled");
//   }
// });

// Logo carousel
(function () {
  const viewport = document.getElementById("logoViewport");
  const track = document.getElementById("logoTrack");
  if (!viewport || !track) return;

  let dir = 1; // 1 => scroll right, -1 => scroll left
  let paused = false;
  let reversing = false;
  const speed = 0.7; // px per frame (tweak)
  const edgePause = 800; // ms pause at each end
  let rafId = null;

  const getMaxScroll = () =>
    Math.max(0, track.scrollWidth - viewport.clientWidth);

  function step() {
    // move if not paused
    if (!paused) {
      viewport.scrollLeft += dir * speed;
      const max = getMaxScroll();

      // clamp & trigger reverse when reaching edges
      if (dir === 1 && viewport.scrollLeft >= max - 0.5) {
        viewport.scrollLeft = max;
        reverseWithPause();
      } else if (dir === -1 && viewport.scrollLeft <= 0.5) {
        viewport.scrollLeft = 0;
        reverseWithPause();
      }
    }

    rafId = requestAnimationFrame(step);
  }

  function reverseWithPause() {
    if (reversing) return; // prevent multiple calls
    reversing = true;
    paused = true;

    setTimeout(() => {
      dir *= -1; // flip direction
      paused = false; // resume movement
      reversing = false;
    }, edgePause);
  }

  // Pause / resume controls
  let pointerDown = false;
  viewport.addEventListener("mouseenter", () => (paused = true));
  viewport.addEventListener("mouseleave", () =>
    pointerDown ? (paused = true) : (paused = false)
  );
  viewport.addEventListener("pointerdown", () => {
    pointerDown = true;
    paused = true;
  });
  window.addEventListener("pointerup", () => {
    pointerDown = false;
    paused = false;
  });

  // Recalculate & clamp scroll on resize
  window.addEventListener("resize", () => {
    const max = getMaxScroll();
    if (viewport.scrollLeft > max) viewport.scrollLeft = max;
  });

  // Start only after images inside track have loaded (so scrollWidth is accurate)
  function startWhenReady() {
    const imgs = Array.from(track.querySelectorAll("img"));
    let toLoad = imgs.length;

    if (toLoad === 0) {
      startLoop();
      return;
    }

    imgs.forEach((img) => {
      if (img.complete) {
        toLoad--;
        if (toLoad === 0) startLoop();
      } else {
        img.addEventListener(
          "load",
          () => {
            toLoad--;
            if (toLoad === 0) startLoop();
          },
          { once: true }
        );
        // handle errored images too
        img.addEventListener(
          "error",
          () => {
            toLoad--;
            if (toLoad === 0) startLoop();
          },
          { once: true }
        );
      }
    });

    // safety fallback: start after 2s if something goes wrong
    setTimeout(() => {
      if (!rafId) startLoop();
    }, 2000);
  }

  function startLoop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(step);
  }

  // Kick off
  startWhenReady();
})();

// Case studies
document.addEventListener("DOMContentLoaded", () => {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const allCards = Array.from(document.querySelectorAll(".testi-card"));
  const cardWrap = document.querySelector(".card-wrap");
  const cardGrid = document.getElementById("cardGrid");
  const toggleBtn = document.getElementById("toggle-cards");

  let currentFilter = "all";
  let expanded = false;

  function applyFilter(filter, expand) {
    currentFilter = filter;
    expanded = expand;

    // Filter cards
    const filtered = allCards.filter(
      (card) => filter === "all" || card.dataset.category === filter
    );

    // Hide all
    allCards.forEach((card) => (card.style.display = "none"));

    // Always show filtered
    filtered.forEach((card) => (card.style.display = "block"));

    // Accordion height
    requestAnimationFrame(() => {
      if (expand) {
        cardWrap.style.maxHeight = cardGrid.scrollHeight + 20 + "px";
      } else {
        // Find first row top
        let firstRowTop = filtered.length > 0 ? filtered[0].offsetTop : 0;
        let lastInRow = [...filtered]
          .filter((c) => c.offsetTop === firstRowTop)
          .pop();
        let rowHeight = lastInRow
          ? lastInRow.offsetTop + lastInRow.offsetHeight - firstRowTop
          : 0;
        cardWrap.style.maxHeight = rowHeight + 20 + "px";
      }
    });

    // Update button text
    const hiddenCount = expand
      ? 0
      : filtered.length -
        [...filtered].filter((c) => c.offsetTop === filtered[0].offsetTop)
          .length;
    toggleBtn.innerHTML = expand
      ? `<img alt="" src="./assets/images/icons/nav-arrow-up.svg"/>`
      : hiddenCount > 0
      ? `+${hiddenCount}`
      : "";
    toggleBtn.style.display =
      hiddenCount > 0 || expand ? "inline-block" : "none";
  }

  // Filter buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      cardWrap.classList.remove("expanded");
      toggleBtn.setAttribute("aria-expanded", false);
      applyFilter(btn.dataset.filter, false);
    });
  });

  // Show More toggle
  toggleBtn.addEventListener("click", () => {
    expanded = !expanded;
    cardWrap.classList.toggle("expanded", expanded);
    toggleBtn.setAttribute("aria-expanded", expanded);
    applyFilter(currentFilter, expanded);
  });

  // Initial
  applyFilter("all", false);

  // Adding active class to the accordion item

  const accordion = document.getElementById("faqAccordion");

  accordion.addEventListener("show.bs.collapse", function (e) {
    // Remove active class from all items
    accordion.querySelectorAll(".accordion-item").forEach((item) => {
      item.classList.remove("active");
    });

    // Add active to the one being opened
    e.target.closest(".accordion-item").classList.add("active");
  });

  accordion.addEventListener("hide.bs.collapse", function (e) {
    e.target.closest(".accordion-item").classList.remove("active");
  });
});

// GSAP Animations

gsap.registerPlugin(ScrollTrigger);

// Animate hero-bg only when hero-section enters the viewport
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

// Hero Title Animation
gsap.from(".hero-title", {
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top 50%", // when top of section hits 50% of viewport
    toggleActions: "play none none reverse",
    once: true, // ✅ ensures animation only runs once per page load
  },
  opacity: 0,
  y: 50,
  duration: 4,
  ease: "power2.out",
});

// Hero Sub Content Animation
gsap.from(".hero-sub-content", {
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
  opacity: 0,
  y: 30,
  duration: 1,
  delay: 0.5,
  ease: "power2.out",
});

// Animate Project Title
gsap.from(".project-title", {
  scrollTrigger: {
    trigger: ".project-section",
    start: "top 50%", // adjust for earlier/later animation
    toggleActions: "play none none reverse",
    once: true, // ✅ ensures animation only runs once per page load
  },
  opacity: 0,
  y: 100,
  duration: 2,
  ease: "power2.out",
});

// Animate each project card only once
const cards = gsap.utils.toArray(".project-card");
const totalCards = cards.length;
let gap, widthStep;

// Set values based on screen width
if (window.innerWidth < 768) {
  gap = 20;
  widthStep = 30;
} else if (window.innerWidth < 1024) {
  gap = 30;
  widthStep = 50;
} else if (window.innerWidth < 1200) {
  gap = 40;
  widthStep = 60;
} else {
  gap = 50;
  widthStep = 80;
}

// Dynamic scroll distance
const scrollDistance = (totalCards - 1) * gap + window.innerHeight * 0.6;

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".project-container-section",
    pin: ".project-container-section",
    start: "top top",
    end: "+=" + scrollDistance,
    scrub: 1.5, // ✅ Smooth scroll-linked animation
    invalidateOnRefresh: true,
  },
});

cards.forEach((card, i) => {
  tl.fromTo(
    card,
    {
      y: window.innerHeight * 0.7 + 100, // slightly smaller travel for smoothness
      opacity: 0,
      maxWidth: `calc(100% - ${(totalCards - i - 1) * widthStep}px)`,
    },
    {
      y: i * gap,
      opacity: 1,
      maxWidth: `calc(100% - ${(totalCards - i - 1) * widthStep}px)`,
      ease: "power2.out", // ✅ smooth deceleration
    },
    i * 0.4 // ✅ slightly reduced stagger for flow
  );
});

// Animate counter
document.addEventListener("DOMContentLoaded", () => {
  // gsap.registerPlugin(ScrollTrigger);

  function buildRolling(wrapper) {
    const raw = (wrapper.dataset.target || "").trim();
    const m = raw.match(/^(\d+)(.*)$/);
    if (!m) {
      wrapper.textContent = raw;
      return;
    }

    const numberString = m[1];
    const suffix = (m[2] || "").trim();

    const numberContainer = document.createElement("div");
    numberContainer.className = "number";
    wrapper.innerHTML = "";
    wrapper.appendChild(numberContainer);

    const digits = numberString.split("");
    const cycles = 3;

    digits.forEach((digitChar, idx) => {
      const targetDigit = parseInt(digitChar, 10);
      const digitCol = document.createElement("div");
      digitCol.className = "digit";

      const list = document.createElement("div");
      list.className = "digit-list";

      // create cycles
      for (let c = 0; c < cycles; c++) {
        for (let n = 0; n <= 9; n++) {
          const item = document.createElement("div");
          item.className = "digit-item";
          item.textContent = n;
          list.appendChild(item);
        }
      }
      // final to target
      for (let n = 0; n <= targetDigit; n++) {
        const item = document.createElement("div");
        item.className = "digit-item";
        item.textContent = n;
        list.appendChild(item);
      }

      digitCol.appendChild(list);
      numberContainer.appendChild(digitCol);
    });

    // append suffix after last digit
    if (suffix) {
      const s = document.createElement("span");
      s.className = "suffix";
      s.textContent = suffix;
      numberContainer.appendChild(s);
    }
  }

  // build all counters first
  document.querySelectorAll(".number-wrapper").forEach(buildRolling);

  // GSAP ScrollTrigger - animate all digits at the same time
  ScrollTrigger.create({
    trigger: ".stats",
    start: "top 80%",
    once: true,
    onEnter: () => {
      const allLists = document.querySelectorAll(".digit-list");
      allLists.forEach((list) => {
        const items = list.querySelectorAll(".digit-item");
        const itemHeight = items[0].getBoundingClientRect().height;
        const finalTranslate = -(items.length - 1) * itemHeight;

        gsap.to(list, {
          y: finalTranslate,
          duration: 1.5,
          ease: "power3.out",
        });
      });
    },
  });
});

// Animate service section Title
gsap.from(".service-title", {
  scrollTrigger: {
    trigger: ".service-section",
    start: "top 50%", // adjust for earlier/later animation
    toggleActions: "play none none reverse",
    once: true, // ✅ ensures animation only runs once per page load
  },
  opacity: 0,
  y: 100,
  duration: 2,
  ease: "power2.out",
});

// Animate service card
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

// Animate method section title
gsap.from(".method-title", {
  scrollTrigger: {
    trigger: ".method-section",
    start: "top 50%", // adjust for earlier/later animation
    toggleActions: "play none none reverse",
    once: true, // ✅ ensures animation only runs once per page load
  },
  opacity: 0,
  y: 100,
  duration: 2,
  ease: "power2.out",
});

// Animate workflow title
gsap.from(".workflow-title", {
  scrollTrigger: {
    trigger: ".workflow-section",
    start: "top 50%", // adjust for earlier/later animation
    toggleActions: "play none none reverse",
    once: true, // ✅ ensures animation only runs once per page load
  },
  opacity: 0,
  y: 100,
  duration: 2,
  ease: "power2.out",
});

// Animate workflow cards
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

// Animate workflow cards
gsap.from(".testimonial-title", {
  scrollTrigger: {
    trigger: ".testimonial-section",
    start: "top 50%", // adjust for earlier/later animation
    toggleActions: "play none none reverse",
    once: true, // ✅ ensures animation only runs once per page load
  },
  opacity: 0,
  y: 100,
  duration: 2,
  ease: "power2.out",
});

// Animate filters
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

// Animate grid-wrapper
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

// Animate comparison title
gsap.from(".comparison-title", {
  scrollTrigger: {
    trigger: ".comparison-section",
    start: "top 50%", // adjust for earlier/later animation
    toggleActions: "play none none reverse",
    once: true, // ✅ ensures animation only runs once per page load
  },
  opacity: 0,
  y: 100,
  duration: 2,
  ease: "power2.out",
});

// Animate comparison table
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

// Animate faq cards
gsap.from(".faq-title", {
  scrollTrigger: {
    trigger: ".faq-section",
    start: "top 50%", // adjust for earlier/later animation
    toggleActions: "play none none reverse",
    once: true, // ✅ ensures animation only runs once per page load
  },
  opacity: 0,
  y: 100,
  duration: 2,
  ease: "power2.out",
});

// Animate accordion items when reaching the section
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

// Animate footer top
gsap.from(".footer-top", {
  scrollTrigger: {
    trigger: ".site-footer",
    start: "top 50%", // adjust for earlier/later animation
    toggleActions: "play none none reverse",
    once: true, // ✅ ensures animation only runs once per page load
  },
  opacity: 0,
  y: 100,
  duration: 2,
  ease: "power2.out",
});
