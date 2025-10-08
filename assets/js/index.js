/********** Put DOM-dependent code inside DOMContentLoaded **********/
document.addEventListener("DOMContentLoaded", () => {
  /********** Logo carousel (safe) **********/
  (function () {
    const viewport = document.getElementById("logoViewport");
    const track = document.getElementById("logoTrack");
    if (!viewport || !track) return;

    let dir = 1;
    let paused = false;
    let reversing = false;
    const speed = 0.7;
    const edgePause = 800;
    let rafId = null;

    const getMaxScroll = () =>
      Math.max(0, track.scrollWidth - viewport.clientWidth);

    function step() {
      if (!paused) {
        viewport.scrollLeft += dir * speed;
        const max = getMaxScroll();

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
      if (reversing) return;
      reversing = true;
      paused = true;
      setTimeout(() => {
        dir *= -1;
        paused = false;
        reversing = false;
      }, edgePause);
    }

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

    window.addEventListener("resize", () => {
      const max = getMaxScroll();
      if (viewport.scrollLeft > max) viewport.scrollLeft = max;
    });

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
      setTimeout(() => {
        if (!rafId) startLoop();
      }, 2000);
    }

    function startLoop() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(step);
    }

    startWhenReady();
  })();

  /********** Case studies filter & expand/collapse (guarded) **********/
  (function () {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const allCards = Array.from(document.querySelectorAll(".testi-card"));
    const cardWrap = document.querySelector(".card-wrap");
    const cardGrid = document.getElementById("cardGrid");
    const toggleBtn = document.getElementById("toggle-cards");

    if (!cardWrap || !cardGrid || allCards.length === 0) {
      // nothing to do
      return;
    }

    let currentFilter = "all";
    let expanded = false;

    function applyFilter(filter, expand) {
      currentFilter = filter;
      expanded = expand;

      const filtered = allCards.filter(
        (card) => filter === "all" || card.dataset.category === filter
      );

      allCards.forEach((card) => (card.style.display = "none"));
      filtered.forEach((card) => (card.style.display = "block"));

      requestAnimationFrame(() => {
        if (expand) {
          cardWrap.style.maxHeight = cardGrid.scrollHeight + 20 + "px";
        } else {
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

      const hiddenCount = expand
        ? 0
        : Math.max(
            0,
            filtered.length -
              [...filtered].filter(
                (c) => c.offsetTop === (filtered[0] ? filtered[0].offsetTop : 0)
              ).length
          );
      if (toggleBtn) {
        toggleBtn.innerHTML = expand
          ? `<img alt="" src="./assets/images/icons/nav-arrow-up.svg"/>`
          : hiddenCount > 0
          ? `+${hiddenCount}`
          : "";
        toggleBtn.style.display =
          hiddenCount > 0 || expand ? "inline-block" : "none";
      }
    }

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        cardWrap.classList.remove("expanded");
        if (toggleBtn) toggleBtn.setAttribute("aria-expanded", false);
        applyFilter(btn.dataset.filter, false);
      });
    });

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        expanded = !expanded;
        cardWrap.classList.toggle("expanded", expanded);
        toggleBtn.setAttribute("aria-expanded", expanded);
        applyFilter(currentFilter, expanded);
      });
    }

    // initial
    applyFilter("all", false);

    // accordion guards (bootstrap events)
    const accordion = document.getElementById("faqAccordion");
    if (accordion) {
      accordion.addEventListener("show.bs.collapse", function (e) {
        accordion
          .querySelectorAll(".accordion-item")
          .forEach((item) => item.classList.remove("active"));
        const item = e.target.closest(".accordion-item");
        if (item) item.classList.add("active");
      });

      accordion.addEventListener("hide.bs.collapse", function (e) {
        const item = e.target.closest(".accordion-item");
        if (item) item.classList.remove("active");
      });
    }
  })();

  /********** Counter animations (GSAP + ScrollTrigger guarded) **********/
  (function () {
    // buildRolling does not depend on GSAP, can build even without it
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
      digits.forEach(() => {
        const digitCol = document.createElement("div");
        digitCol.className = "digit";
        const list = document.createElement("div");
        list.className = "digit-list";
        for (let c = 0; c < cycles; c++) {
          for (let n = 0; n <= 9; n++) {
            const item = document.createElement("div");
            item.className = "digit-item";
            item.textContent = n;
            list.appendChild(item);
          }
        }
        // final target will be appended later by logic (kept simpler)
        digitCol.appendChild(list);
        numberContainer.appendChild(digitCol);
      });

      if (suffix) {
        const s = document.createElement("span");
        s.className = "suffix";
        s.textContent = suffix;
        numberContainer.appendChild(s);
      }
    }

    document.querySelectorAll(".number-wrapper").forEach(buildRolling);

    // Only attempt GSAP animation if gsap and ScrollTrigger are available
    if (window.gsap && window.ScrollTrigger) {
      try {
        ScrollTrigger.create({
          trigger: ".stats",
          start: "top 80%",
          once: true,
          onEnter: () => {
            const allLists = document.querySelectorAll(".digit-list");
            allLists.forEach((list) => {
              const items = list.querySelectorAll(".digit-item");
              if (items.length === 0) return;
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
      } catch (err) {
        // if anything fails with GSAP do not break the rest
        // console.warn("GSAP/ScrollTrigger failed:", err);
      }
    }
  })();
});
