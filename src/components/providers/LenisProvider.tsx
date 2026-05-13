"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { ReactNode, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function LenisBridge() {
  const lenis = useLenis(({ scroll }) => {});

  useEffect(() => {
    if (!lenis) return;

    // Connect Lenis RAF to GSAP ticker so ScrollTrigger reads Lenis position
    function update(time: number) {
      lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Tell ScrollTrigger to use Lenis scroll values
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  return null;
}

export function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
