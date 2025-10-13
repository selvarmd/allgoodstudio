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
  transformOrigin: "top center",
});

// 2️⃣ Animate the rest upward and scale gradually
items.slice(1).forEach((item, i) => {
  const offsetY = (i + 1) * 50; // each card 50px lower
  const scale = 0.8 + ((i + 1) / (items.length - 1)) * 0.2; // from 0.8 → 1.0

  tl.to(
    item,
    {
      y: offsetY,
      scale: scale,
      duration: 1,
      ease: "power2.out",
      transformOrigin: "top center",
    },
    i
  );
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
  invalidateOnRefresh: true,
});
