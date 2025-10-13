/********** Animate on scroll inuitialization **********/
AOS.init({
  once: true, // ✅ ensures animation happens only once (no reverse)
  easing: "ease-out", // optional: smoother fade-up
});

/********** Scroll to top when page loads **********/
window.addEventListener("pageshow", (event) => {
  // always try to reset scroll on page show / bfcache restore
  window.scrollTo(0, 0);
});

/********** adding expanded classs to the header **********/
document.addEventListener("DOMContentLoaded", () => {
  // siteloader gif
  const loader = document.getElementById("siteLoader");
  if (loader) {
    loader.classList.add("hidden");
    setTimeout(() => loader.remove(), 1000); // remove after fade-out
  }

  const toggler = document.querySelector(".navbar-toggler");
  const siteHeader = document.querySelector(".site-header");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  // Hamburger toggle
  toggler.addEventListener("click", () => {
    toggler.classList.toggle("open");
    siteHeader.classList.toggle("expanded");

    // Block / allow scroll
    if (siteHeader.classList.contains("expanded")) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  });

  // Nav link click → close menu & reset states
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const navbarCollapse = document.querySelector(".navbar-collapse.show");

      if (navbarCollapse) {
        new bootstrap.Collapse(navbarCollapse, { toggle: true });
      }

      siteHeader.classList.remove("expanded");
      document.body.classList.remove("no-scroll");
    });
  });
});

/********** Put DOM-dependent code inside DOMContentLoaded **********/
document.addEventListener("DOMContentLoaded", () => {
  /********** Sticky header (guarded) **********/
  const headerEl = document.querySelector("header");
  if (headerEl) {
    const onStickyScroll = () => {
      if (window.scrollY > 0) headerEl.classList.add("scrolled");
      else headerEl.classList.remove("scrolled");
    };
    // initial and bind
    onStickyScroll();
    window.addEventListener("scroll", onStickyScroll, { passive: true });
  }

  /********** Header theme switching based on section data-theme **********/
  (function () {
    const header = document.querySelector(".site-header");
    const sections = Array.from(document.querySelectorAll("[data-theme]"));
    if (!header || sections.length === 0) return;

    function updateHeaderTheme() {
      const headerHeight = header.offsetHeight;
      let currentSection = null;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        // choose last section that has its top <= headerHeight
        if (rect.top <= headerHeight) {
          currentSection = section;
        }
      }

      if (currentSection) {
        const theme = currentSection.dataset.theme || "light";
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

    window.addEventListener("scroll", updateHeaderTheme, { passive: true });
    window.addEventListener("load", updateHeaderTheme);
    updateHeaderTheme();

    // smooth nav links (guard)
    document.querySelectorAll('.nav-link[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          // scroll into view; header offset can be applied here if needed
          window.scrollTo({
            top: targetEl.offsetTop,
            behavior: "smooth",
          });
        }
      });
    });
  })();

  /*********** Custom Cursor (guarded) *************/
  (function () {
    const cursor = document.querySelector(".custom-cursor");
    if (!cursor) return;

    const portfolioWrapper = document.querySelector(".portfolio-section");
    const header = document.querySelector(".site-header");
    const footer = document.querySelector(".footer-bottom");
    const shutters = document.querySelectorAll(".shutter");
    const allLinks = document.querySelectorAll("a, button");

    // === Move custom cursor ===
    document.addEventListener("mousemove", (e) => {
      cursor.style.top = e.clientY + "px";
      cursor.style.left = e.clientX + "px";
      cursor.classList.add("active");
    });

    // === Portfolio-section logic (keep as is) ===
    if (portfolioWrapper) {
      portfolioWrapper.addEventListener("mouseenter", () =>
        cursor.classList.add("text-mode")
      );
      portfolioWrapper.addEventListener("mouseleave", () =>
        cursor.classList.remove("text-mode")
      );

      portfolioWrapper.querySelectorAll(".portfolio-link").forEach((link) => {
        link.addEventListener("mouseenter", () => {
          cursor.style.display = "flex";
          cursor.classList.add("text-mode");
          link.style.cursor = "none";
        });
        link.addEventListener("mouseleave", () => {
          cursor.style.display = "flex";
          link.style.cursor = "none";
        });
      });

      portfolioWrapper
        .querySelectorAll(".category-wrapper, .category-wrapper *")
        .forEach((el) => {
          el.addEventListener("mouseenter", () => {
            cursor.style.display = "none";
            el.style.cursor = "auto";
          });
          el.addEventListener("mouseleave", () => {
            cursor.style.display = "flex";
            el.style.cursor = "none";
          });
        });
    }

    // === Helper: system pointer toggle ===
    const enableSystemPointer = (el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.display = "none"; // hide custom cursor
        el.style.cursor = "pointer"; // use system pointer
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.display = "flex"; // show custom cursor again
        el.style.cursor = "none";
      });
    };

    // === Apply pointer behavior ===
    [header, footer].forEach((el) => el && enableSystemPointer(el));
    shutters.forEach((el) => enableSystemPointer(el));

    // all <a> tags except those inside portfolio-section
    allLinks.forEach((link) => {
      if (!link.closest(".portfolio-section")) {
        enableSystemPointer(link);
      }
    });
  })();
});
