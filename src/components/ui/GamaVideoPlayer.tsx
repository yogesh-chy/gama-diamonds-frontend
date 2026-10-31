"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Loader2, AlertCircle } from "lucide-react";
import {
  getOptimizedMp4Url,
  getHlsStreamingUrl,
  getVideoPosterUrl,
  detectVideoFormat,
  isCloudinaryUrl,
  VideoDeliveryStrategy,
} from "@/lib/cloudinaryVideo";

export interface GamaVideoPlayerProps {
  src: string;
  poster?: string;
  alt?: string;
  strategy?: VideoDeliveryStrategy;
  width?: number; // Target display width for Cloudinary resolution optimization
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  preload?: "auto" | "metadata" | "none";
  showBadge?: boolean;
  badgeText?: string;
  showCustomControls?: boolean;
  lazy?: boolean;
  pauseWhenOutOfView?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onFullscreen?: () => void;
  onClick?: (e: React.MouseEvent<HTMLVideoElement>) => void;
}

// Global broadcast event name to ensure only one video plays at a time
export const GAMA_VIDEO_PLAY_EVENT = "gama:video-play";

export default function GamaVideoPlayer({
  src,
  poster,
  alt = "Product Video Showcase",
  strategy = "auto",
  width,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  preload = "metadata",
  showBadge = true,
  badgeText = "360° View",
  showCustomControls = true,
  lazy = true,
  pauseWhenOutOfView = true,
  className,
  style,
  onPlay,
  onPause,
  onEnded,
  onFullscreen,
  onClick,
}: GamaVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const playerIdRef = useRef<string>(`gama-player-${Math.random().toString(36).substring(2, 9)}`);

  const [isInView, setIsInView] = useState(!lazy);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeSource, setActiveSource] = useState<string>("");
  const [isUsingHls, setIsUsingHls] = useState(false);

  // Derive poster image: use provided poster, or extract Cloudinary frame 0
  const resolvedPoster = poster || getVideoPosterUrl(src, { width: width || 720 }) || undefined;

  // Resolve video sources based on strategy
  const resolveSources = useCallback(() => {
    if (!src) return { hls: null, mp4: "", original: "" };

    const detected = detectVideoFormat(src);

    if (detected === "hls" || src.includes(".m3u8")) {
      return { hls: src, mp4: "", original: src };
    }

    if (strategy === "hls") {
      const hlsUrl = getHlsStreamingUrl(src);
      return { hls: hlsUrl, mp4: getOptimizedMp4Url(src, { width }), original: src };
    }

    if (strategy === "mp4") {
      return { hls: null, mp4: getOptimizedMp4Url(src, { width }), original: src };
    }

    // Auto strategy: deliver optimized MP4 with immediate fallback to original src
    if (isCloudinaryUrl(src)) {
      return {
        hls: null,
        mp4: getOptimizedMp4Url(src, { width }),
        original: src,
      };
    }

    return { hls: null, mp4: src, original: src };
  }, [src, strategy, width]);

  // Viewport IntersectionObserver for lazy loading & auto-pausing
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsInView(true);
        } else if (pauseWhenOutOfView) {
          // Pause when completely out of viewport to conserve memory & bandwidth
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
          }
        }
      },
      {
        rootMargin: "150px", // Preload slightly before entering view
        threshold: 0.15,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [pauseWhenOutOfView]);

  // Attach and initialize video (Native HLS / hls.js / MP4 fallback)
  useEffect(() => {
    if (!isInView || !src) return;

    const video = videoRef.current;
    if (!video) return;

    const { hls: hlsUrl, mp4: mp4Url, original } = resolveSources();
    let cancelled = false;

    setHasError(false);

    // Cleanup any existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const startPlayback = () => {
      if (!autoPlay || !video || cancelled) return;
      video.muted = isMuted;
      video.playsInline = playsInline;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!cancelled) setIsPlaying(true);
          })
          .catch(() => {
            if (!cancelled && video) {
              video.muted = true;
              setIsMuted(true);
              video
                .play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
            }
          });
      }
    };

    // Attempt HLS if requested and available
    if (hlsUrl) {
      // 1. Native Safari HLS
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
        setActiveSource(hlsUrl);
        setIsUsingHls(true);
        video.onloadedmetadata = () => startPlayback();
        video.onerror = () => {
          if (!cancelled) {
            const fallback = mp4Url || original;
            if (fallback) {
              video.src = fallback;
              setActiveSource(fallback);
              setIsUsingHls(false);
              video.onerror = () => {
                if (original && fallback !== original) {
                  video.src = original;
                  setActiveSource(original);
                } else {
                  setHasError(true);
                }
              };
              startPlayback();
            } else {
              setHasError(true);
            }
          }
        };
      }
      // 2. hls.js for Chrome, Firefox, Edge, Android
      else if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 30,
        });
        hlsRef.current = hls;

        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          if (!cancelled) {
            hls.loadSource(hlsUrl);
            setActiveSource(hlsUrl);
            setIsUsingHls(true);
          }
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (!cancelled) {
            startPlayback();
          }
        });

        // Error handling with graceful fallback to optimized MP4 / direct MP4
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            hls.destroy();
            hlsRef.current = null;
            if (video && !cancelled) {
              const fallback = mp4Url || original;
              if (fallback) {
                video.src = fallback;
                setActiveSource(fallback);
                setIsUsingHls(false);
                video.onerror = () => {
                  if (original && fallback !== original) {
                    video.src = original;
                    setActiveSource(original);
                    startPlayback();
                  } else {
                    setHasError(true);
                  }
                };
                startPlayback();
              } else {
                setHasError(true);
              }
            }
          }
        });
      } else {
        const fallback = mp4Url || original;
        if (fallback) {
          video.src = fallback;
          setActiveSource(fallback);
          setIsUsingHls(false);
          video.onloadedmetadata = () => startPlayback();
        }
      }
    } else {
      // Direct MP4 / Optimized MP4
      const primaryMp4 = mp4Url || original;
      video.src = primaryMp4;
      setActiveSource(primaryMp4);
      setIsUsingHls(false);
      video.onloadedmetadata = () => startPlayback();
      video.onerror = () => {
        if (!cancelled && original && primaryMp4 !== original) {
          video.src = original;
          setActiveSource(original);
          video.onerror = () => setHasError(true);
          startPlayback();
        } else {
          setHasError(true);
        }
      };
    }

    return () => {
      cancelled = true;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.onloadedmetadata = null;
        video.onerror = null;
      }
    };
  }, [isInView, src, autoPlay, isMuted, playsInline, resolveSources]);

  // Single video playback listener (pause if another video starts playing)
  useEffect(() => {
    const handleGlobalPlay = (e: Event) => {
      const customEvent = e as CustomEvent<{ playerId: string }>;
      if (customEvent.detail?.playerId !== playerIdRef.current) {
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      }
    };

    window.addEventListener(GAMA_VIDEO_PLAY_EVENT, handleGlobalPlay);
    return () => window.removeEventListener(GAMA_VIDEO_PLAY_EVENT, handleGlobalPlay);
  }, []);

  // Broadcast when this player plays
  const handleNativePlay = () => {
    setIsPlaying(true);
    setIsBuffering(false);
    window.dispatchEvent(
      new CustomEvent(GAMA_VIDEO_PLAY_EVENT, {
        detail: { playerId: playerIdRef.current },
      })
    );
    if (onPlay) onPlay();
  };

  const handleNativePause = () => {
    setIsPlaying(false);
    if (onPause) onPause();
  };

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFullscreen) {
      onFullscreen();
      return;
    }
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#000000",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <video
        ref={videoRef}
        poster={resolvedPoster}
        autoPlay={autoPlay}
        muted={isMuted}
        loop={loop}
        playsInline={playsInline}
        preload={preload}
        onPlay={handleNativePlay}
        onPause={handleNativePause}
        onPlaying={() => setIsBuffering(false)}
        onWaiting={() => {
          if (videoRef.current && !videoRef.current.paused) {
            setIsBuffering(true);
          }
        }}
        onCanPlay={() => setIsBuffering(false)}
        onTimeUpdate={() => {
          if (isBuffering) setIsBuffering(false);
        }}
        onEnded={onEnded}
        onError={() => {
          // Fall back to MP4 if HLS was attempted and failed
          const { mp4 } = resolveSources();
          if (isUsingHls && mp4 && videoRef.current) {
            videoRef.current.src = mp4;
            setIsUsingHls(false);
            videoRef.current.play().catch(() => {});
          } else {
            setHasError(true);
          }
        }}
        onClick={(e) => {
          if (onClick) onClick(e);
          else togglePlay();
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          cursor: "pointer",
        }}
      />

      {/* Top-left Minimal Luxury Badge */}
      {showBadge && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            border: "1px solid rgba(198, 164, 95, 0.35)",
            backdropFilter: "blur(6px)",
            fontSize: "9.5px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            color: "#c6a45f",
            textTransform: "uppercase",
            pointerEvents: "none",
            borderRadius: "2px",
            zIndex: 3,
          }}
        >
          <Sparkles size={11} color="#c6a45f" />
          <span>{badgeText}</span>
        </div>
      )}

      {/* Centered Play Button Overlay when Paused */}
      {!isPlaying && !hasError && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play video"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.35)",
            border: "none",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1.5px solid #c6a45f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(198, 164, 95, 0.3)",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
          >
            <Play size={20} fill="#c6a45f" color="#c6a45f" style={{ marginLeft: "3px" }} />
          </div>
        </button>
      )}

      {/* Floating Bottom-Right Luxury Control Pill */}
      {showCustomControls && !hasError && (
        <div
          style={{
            position: "absolute",
            bottom: "14px",
            right: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            border: "1px solid rgba(198, 164, 95, 0.35)",
            backdropFilter: "blur(8px)",
            padding: "5px 10px",
            borderRadius: "20px",
            zIndex: 3,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Play / Pause Toggle */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            style={{
              background: "none",
              border: "none",
              color: "#c6a45f",
              cursor: "pointer",
              padding: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} fill="#c6a45f" />}
          </button>

          {/* Mute / Unmute Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            style={{
              background: "none",
              border: "none",
              color: "#c6a45f",
              cursor: "pointer",
              padding: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            style={{
              background: "none",
              border: "none",
              color: "#c6a45f",
              cursor: "pointer",
              padding: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Maximize2 size={12} />
          </button>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            gap: "8px",
            color: "#a0a0a0",
            fontSize: "12px",
            zIndex: 3,
          }}
        >
          <AlertCircle size={24} color="#c6a45f" />
          <span>Video preview unavailable</span>
        </div>
      )}
    </div>
  );
}
