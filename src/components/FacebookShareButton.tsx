"use client";

import { useEffect, useRef } from "react";
import { useFacebookSDK } from "@/hooks/useFacebookSDK";

interface FacebookShareButtonProps {
  href: string;
  layout?: "button" | "button_count" | "box_count" | "icon";
  size?: "small" | "large";
  className?: string;
  onShare?: () => void;
}

export function FacebookShareButton({
  href,
  layout = "button",
  size = "small",
  className = "",
  onShare
}: FacebookShareButtonProps) {
  const { fbReady, FB } = useFacebookSDK();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fbReady && FB && containerRef.current) {
      // Parse the Facebook button
      try {
        FB.XFBML.parse(containerRef.current);

      } catch (e) {

      }
    }
  }, [fbReady, FB, href]);

  return (
    <div ref={containerRef} className={className}>
      <div
        className="fb-share-button"
        data-href={href}
        data-layout={layout}
        data-size={size}
        onClick={onShare}
      />
    </div>
  );
}

export default FacebookShareButton;