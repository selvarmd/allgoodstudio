// after DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initShutter("#shutter", 50);
});

// Shutter block JS: initShutter(containerSelector, { initialPercent: 60 })
(function () {
  function initShutter(selector, initialPercent = 50) {
    const shutter = document.querySelector(selector);
    if (!shutter) return;

    const topPanel = shutter.querySelector(".shutter-panel--top");
    const handle = shutter.querySelector(".shutter-handle");

    let isDragging = false;
    let percent = initialPercent;

    function setPosition(p) {
      percent = Math.max(0, Math.min(100, p));
      topPanel.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
      handle.style.left = `${percent}%`;
    }

    function onMouseDown(e) {
      isDragging = true;
      handle.classList.add("dragging");
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(e) {
      if (!isDragging) return;
      const rect = shutter.getBoundingClientRect();
      const pos = ((e.clientX - rect.left) / rect.width) * 100;
      setPosition(pos);
    }

    function onMouseUp() {
      isDragging = false;
      handle.classList.remove("dragging");
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    // Click anywhere to move shutter toward that side
    shutter.addEventListener("click", (e) => {
      if (isDragging) return;
      const rect = shutter.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const currentX = (percent / 100) * rect.width;
      const step = 20;
      if (clickX > currentX + 10) setPosition(percent + step);
      else if (clickX < currentX - 10) setPosition(percent - step);
      topPanel.style.transition = "clip-path 0.3s ease";
      handle.style.transition = "left 0.3s ease";
      setTimeout(() => {
        topPanel.style.transition = "";
        handle.style.transition = "";
      }, 300);
    });

    handle.addEventListener("mousedown", onMouseDown);
    setPosition(percent);
  }

  window.initShutter = initShutter;
})();
