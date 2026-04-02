// hooks/useResponsive.js
import { useState, useEffect } from "react";

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [breakpoint, setBreakpoint] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Determine breakpoint
      if (window.innerWidth < 640) setBreakpoint("xs");
      else if (window.innerWidth < 768) setBreakpoint("sm");
      else if (window.innerWidth < 1024) setBreakpoint("md");
      else if (window.innerWidth < 1280) setBreakpoint("lg");
      else if (window.innerWidth < 1536) setBreakpoint("xl");
      else setBreakpoint("2xl");
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width: windowSize.width,
    height: windowSize.height,
    breakpoint,
    isMobile: breakpoint === "xs" || breakpoint === "sm",
    isTablet: breakpoint === "md",
    isDesktop:
      breakpoint === "lg" || breakpoint === "xl" || breakpoint === "2xl",
  };
}

// Usage
function Component() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TableView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
