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

// Hero Title Animation
gsap.from(".hero-title", {
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top 85%", // when top of section hits 85% of viewport
    toggleActions: "play none none reverse",
  },
  opacity: 0,
  y: 50,
  duration: 2,
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
    start: "top 85%", // adjust for earlier/later animation
    toggleActions: "play none none reverse",
  },
  opacity: 0,
  y: 100,
  duration: 2,
  ease: "power2.out",
});

// Animate each project card only once
// let cards = gsap.utils.toArray(".project-card");

// cards.forEach((card, i) => {
//   gsap.to(card, {
//     opacity: 1,
//     y: 0,
//     duration: 1,
//     ease: "power3.out",
//     scrollTrigger: {
//       trigger: ".project-container",
//       start: () => "top+=" + i * window.innerHeight + " top",
//       end: () => "+=" + window.innerHeight,
//       scrub: true,
//       pin: true,
//       pinSpacing: false,
//     },
//   });

//   // make sure higher cards are above lower ones
//   card.style.zIndex = cards.length - i;
// });
const cards = gsap.utils.toArray(".project-card");
const totalCards = cards.length;
let gap, widthStep;

// Set values based on screen width
if (window.innerWidth < 768) {
  gap = 20; // smaller gap for mobile
  widthStep = 30; // smaller width difference
} else if (window.innerWidth < 1024) {
  gap = 30; // smaller gap for mobile
  widthStep = 50; // smaller width difference
} else if (window.innerWidth < 1200) {
  gap = 40;
  widthStep = 60;
} else {
  gap = 50;
  widthStep = 80;
}

// Dynamic scroll distance based on number of cards
const scrollDistance = (totalCards - 1) * gap + window.innerHeight * 0.6;

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".project-container-section",
    pin: ".project-container-section",
    start: "top top", // ✅ pin starts when container reaches top of viewport
    end: "+=" + scrollDistance,
    scrub: true,
    invalidateOnRefresh: true,
  },
});

cards.forEach((card, i) => {
  tl.fromTo(
    card,
    {
      y: window.innerHeight / 2 + 100, // start below container (bottom)
      opacity: 0,
      maxWidth: `calc(100% - ${(totalCards - i - 1) * widthStep}px)`,
    },
    {
      y: i * gap, // move into the stack from top
      opacity: 1,
      maxWidth: `calc(100% - ${(totalCards - i - 1) * widthStep}px)`,
      ease: "power3.out",
    },
    i * 0.5 // stagger
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
