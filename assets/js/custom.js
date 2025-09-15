/********** Scroll to top when page loads **********/
// Ensure page always starts at top on load
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    // If the page was restored from bfcache (back/forward cache)
    window.scrollTo(0, 0);
  } else {
    // Normal reload
    window.scrollTo(0, 0);
  }
});

// Only reload after the page is fully loaded
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0);

  let resizeTimeout;
  let initialWidth = window.innerWidth;
  let initialHeight = window.innerHeight;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      if (
        window.innerWidth !== initialWidth ||
        window.innerHeight !== initialHeight
      ) {
        window.scrollTo(0, 0);
        window.location.reload();
      }
    }, 250);
  });
});

/********** Sticky header **********/
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 0) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/********** Adding theme color for teh header based on the section theme color **********/
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const sections = Array.from(document.querySelectorAll("main section"));
  if (!header || sections.length === 0) return;

  function updateHeaderTheme() {
    const headerHeight = header.offsetHeight;
    let currentSection = null;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();

      // Check if section top has crossed header line (viewport top + header height)
      if (rect.top <= headerHeight) {
        currentSection = section;
      }
    }

    if (currentSection) {
      const theme = currentSection.dataset.theme || "light";

      // Apply theme only if it actually changed
      if (theme === "dark" && !header.classList.contains("dark-header")) {
        header.classList.add("dark-header");
        header.classList.remove("light-header");
      } else if (
        theme === "light" &&
        !header.classList.contains("light-header")
      ) {
        header.classList.add("light-header");
        header.classList.remove("dark-header");
      }
    }
  }

  // Attach scroll + load listeners
  window.addEventListener("scroll", updateHeaderTheme);
  window.addEventListener("load", updateHeaderTheme);

  // Smooth scroll for nav links with offset for header height
  document.querySelectorAll('.nav-link[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        window.scrollTo({
          top: targetEl.offsetTop, // no subtraction needed
          behavior: "smooth",
        });
      }
    });
  });
});

/********** Logo carousel **********/
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

/********** Case studies filter section and expand/collapse **********/
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

/********** Counter animations **********/
document.addEventListener("DOMContentLoaded", () => {
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

/****************** Custom Cursor *********************/
function initCustomCursor() {
  const cursor = document.querySelector(".custom-cursor");
  const projectCards = document.querySelectorAll(".project-card");
  const projectContainer = document.querySelector(".project-container");
  let lastMousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let activeCard = null;
  let hideTimeout = null;

  // Track mouse position globally
  document.addEventListener("mousemove", (e) => {
    lastMousePos.x = e.clientX;
    lastMousePos.y = e.clientY;
    cursor.style.left = `${lastMousePos.x}px`;
    cursor.style.top = `${lastMousePos.y}px`;
  });

  function activateCursor(card, event) {
    if (card === projectCards[projectCards.length - 1]) {
      deactivateCursor();
      document.body.style.cursor = "auto";
      return;
    }

    clearTimeout(hideTimeout);
    if (event) {
      lastMousePos.x = event.clientX;
      lastMousePos.y = event.clientY;
    }
    cursor.style.left = `${lastMousePos.x}px`;
    cursor.style.top = `${lastMousePos.y}px`;

    const color = card.dataset.cursorColor || "#000";
    cursor.style.background = color;

    cursor.style.transform = "translate(-50%, -50%) scale(1)";
    cursor.style.opacity = 1;
    document.body.style.cursor = "none";
    activeCard = card;
  }

  function deactivateCursor() {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      cursor.style.opacity = 0;
      cursor.style.transform = "translate(-50%, -50%) scale(0)";
      document.body.style.cursor = "auto";
      activeCard = null;
    }, 120);
  }

  projectCards.forEach((card) => {
    card.addEventListener("pointerenter", (e) => activateCursor(card, e));
    card.addEventListener("pointerleave", () => {
      if (card === projectCards[projectCards.length - 1]) {
        document.body.style.cursor = "auto";
      }
      deactivateCursor();
    });
    // card.addEventListener("click", () => {
    //   if (card.dataset.link) window.location.href = card.dataset.link;
    // });
  });

  projectContainer.addEventListener("mouseleave", () => {
    deactivateCursor();
    document.body.style.cursor = "auto";
  });

  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      let hoveredCard = null;
      projectCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (
          lastMousePos.x >= rect.left &&
          lastMousePos.x <= rect.right &&
          lastMousePos.y >= rect.top &&
          lastMousePos.y <= rect.bottom
        ) {
          hoveredCard = card;
        }
      });

      if (hoveredCard) {
        if (hoveredCard === projectCards[projectCards.length - 1]) {
          deactivateCursor();
          document.body.style.cursor = "auto";
        } else if (hoveredCard !== activeCard) {
          activateCursor(hoveredCard);
        }
      } else {
        deactivateCursor();
      }
    }, 50);
  });
}

// Initialize only if screen width > 992px
if (window.innerWidth > 992) {
  initCustomCursor();
}

// Optional: Re-check on resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 991 && !window.customCursorInitialized) {
    initCustomCursor();
    window.customCursorInitialized = true;
  } else if (window.innerWidth <= 992 && window.customCursorInitialized) {
    // Remove custom cursor if needed
    const cursor = document.querySelector(".custom-cursor");
    if (cursor) cursor.style.opacity = 0;
    document.body.style.cursor = "auto";
    window.customCursorInitialized = false;
    // Optionally, you can remove all event listeners here
  }
});
