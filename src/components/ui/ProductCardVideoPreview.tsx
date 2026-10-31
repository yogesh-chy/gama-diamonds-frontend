"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Play } from "lucide-react";
import { getOptimizedMp4Url, getVideoPosterUrl } from "@/lib/cloudinaryVideo";
import { GAMA_VIDEO_PLAY_EVENT } from "./GamaVideoPlayer";

interface ProductCardVideoPreviewProps {
  videoUrl?: string | null;
  imageUrl?: string;
  title: string;
  width?: number;
  className?: string;
}

export default function ProductCardVideoPreview({
  videoUrl,
  imageUrl,
  title,
  width = 380,
  className,
}: ProductCardVideoPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewIdRef = useRef<string>(`card-preview-${Math.random().toString(36).substring(2, 9)}`);

  // Optimized lightweight MP4 for card preview (width: 360px)
  const optimizedVideoSrc = videoUrl ? getOptimizedMp4Url(videoUrl, { width }) : null;
  const posterSrc = imageUrl || (videoUrl ? getVideoPosterUrl(videoUrl, { width }) || undefined : undefined);

  // Single video playback listener
  useEffect(() => {
    const handleGlobalPlay = (e: Event) => {
      const customEvent = e as CustomEvent<{ playerId: string }>;
      if (customEvent.detail?.playerId !== previewIdRef.current) {
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
          setIsHovered(false);
        }
      }
    };

    window.addEventListener(GAMA_VIDEO_PLAY_EVENT, handleGlobalPlay);
    return () => window.removeEventListener(GAMA_VIDEO_PLAY_EVENT, handleGlobalPlay);
  }, []);

  // Pause when scrolled out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting && videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
          setIsHovered(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (!optimizedVideoSrc) return;
    setIsHovered(true);
    setIsVideoLoaded(true);

    // Broadcast play event to pause other playing videos
    window.dispatchEvent(
      new CustomEvent(GAMA_VIDEO_PLAY_EVENT, {
        detail: { playerId: previewIdRef.current },
      })
    );

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 50);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#0d0d0d",
      }}
    >
      {/* Base Image / Poster */}
      <img
        src={posterSrc}
        alt={title}
        loading="lazy"
        decoding="async"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transition: "opacity 0.3s ease, transform 0.4s ease",
          opacity: isHovered && isVideoLoaded ? 0 : 1,
          transform: isHovered ? "scale(1.04)" : "scale(1)",
        }}
      />

      {/* Lazy-loaded Video Preview (only loads on hover) */}
      {optimizedVideoSrc && isVideoLoaded && (
        <video
          ref={videoRef}
          src={optimizedVideoSrc}
          muted
          loop
          playsInline
          preload="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Subtle 360° indicator badge on cards that possess a video */}
      {videoUrl && (
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "3px 7px",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            border: "1px solid rgba(198, 164, 95, 0.4)",
            backdropFilter: "blur(4px)",
            borderRadius: "2px",
            fontSize: "8.5px",
            fontWeight: 700,
            letterSpacing: "1px",
            color: "#c6a45f",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <Sparkles size={9} color="#c6a45f" />
          <span>360°</span>
        </div>
      )}
    </div>
  );
}
