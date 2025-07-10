import { useEffect, useRef, useState } from "react";

export default function ScrollingTitle({ text, className = "" }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const animationRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;

    if (!container || !textEl) return;

    // Clean up previous animations
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const checkOverflow = () => {
      const containerStyle = getComputedStyle(container);
      const paddingLeft = parseFloat(containerStyle.paddingLeft || "0");
      const paddingRight = parseFloat(containerStyle.paddingRight || "0");
      const containerWidth = container.offsetWidth - paddingLeft - paddingRight;
      const textWidth = textEl.scrollWidth;
      const overflow = textWidth - containerWidth;

      if (overflow <= 0) {
        // Text fits, no scrolling needed
        setIsScrolling(false);
        textEl.style.transition = "";
        textEl.style.transform = "translateX(0)";
        return;
      }

      setIsScrolling(true);
      let direction = -1; // -1 for left, 1 for right
      let isCancelled = false;

      // Reset position
      textEl.style.transition = "none";
      textEl.style.transform = "translateX(0)";

      // Start animation after initial delay
      timeoutRef.current = setTimeout(() => {
        if (isCancelled) return;

        const animate = () => {
          if (isCancelled) return;

          // Calculate scroll distance - just enough to show the hidden text
          const scrollDistance = overflow + 4;

          if (direction === -1) {
            // Scroll left
            textEl.style.transition =
              "transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            textEl.style.transform = `translateX(-${scrollDistance}px)`;
          } else {
            // Scroll right back to start
            textEl.style.transition =
              "transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            textEl.style.transform = "translateX(0)";
          }

          direction *= -1;
        };

        animate();

        // Continue animation loop
        animationRef.current = setInterval(() => {
          if (isCancelled) return;
          animate();
        }, 10000); // 8s animation + 2s pause
      }, 1500); // Initial delay

      return () => {
        isCancelled = true;
        clearTimeout(timeoutRef.current);
        clearInterval(animationRef.current);
      };
    };

    // Initial check
    const cleanup = checkOverflow();

    // Recheck on resize
    const resizeObserver = new ResizeObserver(() => {
      if (cleanup) cleanup();
      setTimeout(checkOverflow, 100);
    });

    resizeObserver.observe(container);

    return () => {
      if (cleanup) cleanup();
      resizeObserver.disconnect();
      clearTimeout(timeoutRef.current);
      clearInterval(animationRef.current);
      if (textEl) {
        textEl.style.transition = "";
        textEl.style.transform = "translateX(0)";
      }
    };
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden whitespace-nowrap ${className}`}
    >
      <div
        ref={textRef}
        className="inline-block font-body text-heading-4 md:text-heading-5 font-semibold text-gray-700"
        style={{
          willChange: "transform",
          backfaceVisibility: "hidden",
          perspective: "1000px",
        }}
      >
        {text}
      </div>
    </div>
  );
}
