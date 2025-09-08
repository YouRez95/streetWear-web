import { useEffect, useState } from "react";

export function useKeyboardOffset() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!window.visualViewport) return;

    const onResize = () => {
      const viewport = window.visualViewport!;
      const diff = window.innerHeight - viewport.height; // keyboard height
      setOffset(diff > 0 ? diff : 0);
    };

    window.visualViewport.addEventListener("resize", onResize);
    return () => window.visualViewport?.removeEventListener("resize", onResize);
  }, []);

  return offset;
}
