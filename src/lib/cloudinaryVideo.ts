/**
 * High-Performance Cloudinary Video Delivery & Streaming Utility for Gama Jewels
 * 
 * Provides:
 * 1. Short Product Videos (Optimized MP4 with q_auto, f_auto, and responsive dimensions)
 * 2. Longer Videos (HLS Adaptive Bitrate Streaming with sp_auto and .m3u8 manifests)
 * 3. Video Poster Frame Generation (so_0 start offset for instant thumbnail rendering)
 * 4. Format detection and backward compatibility for non-Cloudinary / local URLs.
 */

export interface CloudinaryVideoInfo {
  cloudName: string;
  resourceType: "video" | "image";
  version: string | null;
  publicId: string;
  format: string;
}

export type VideoDeliveryStrategy = "mp4" | "hls" | "auto";

/**
 * Checks whether a given URL is a Cloudinary-hosted asset.
 */
export function isCloudinaryUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== "string") return false;
  return url.includes("res.cloudinary.com");
}

/**
 * Parses Cloudinary video URLs to extract cloud name, publicId, version, and format.
 */
export function parseCloudinaryVideo(url: string | undefined | null): CloudinaryVideoInfo | null {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/^https?:\/\/res\.cloudinary\.com\/([^/]+)\/(video|image)\/upload\/(.*)$/i);
  if (!match) return null;

  const cloudName = match[1];
  const resourceType = match[2].toLowerCase() as "video" | "image";
  const rest = match[3];

  const parts = rest.split("/");
  let publicIdParts: string[] = [];
  let version: string | null = null;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (/^v\d+$/.test(part)) {
      version = part;
      publicIdParts = parts.slice(i + 1);
      break;
    }
  }

  if (publicIdParts.length === 0) {
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (
        !part.includes(",") &&
        !part.startsWith("q_") &&
        !part.startsWith("f_") &&
        !part.startsWith("w_") &&
        !part.startsWith("sp_") &&
        !part.startsWith("so_") &&
        !part.startsWith("vc_")
      ) {
        publicIdParts = parts.slice(i);
        break;
      }
    }
  }

  const fullId = publicIdParts.join("/");
  const lastDot = fullId.lastIndexOf(".");
  const publicId = lastDot !== -1 ? fullId.slice(0, lastDot) : fullId;
  const format = lastDot !== -1 ? fullId.slice(lastDot + 1).toLowerCase() : "";

  return { cloudName, resourceType, version, publicId, format };
}

/**
 * Strategy A: Short Product Videos — Optimized MP4
 * Generates an MP4 URL with Cloudinary automatic format (f_auto), automatic quality (q_auto),
 * and responsive width constraints.
 */
export function getOptimizedMp4Url(
  url: string | undefined | null,
  options?: {
    width?: number;
    quality?: "auto" | "eco" | "good" | "best" | number;
    format?: "auto" | "mp4" | "webm";
  }
): string {
  if (!url) return "";
  const parsed = parseCloudinaryVideo(url);
  if (!parsed || !parsed.publicId) return url;

  const width = options?.width ? `,w_${options.width}` : "";
  const quality = options?.quality ? `,q_${options.quality}` : ",q_auto";
  const format = options?.format ? `f_${options.format}` : "f_auto";
  const ver = parsed.version ? `/${parsed.version}` : "";

  return `https://res.cloudinary.com/${parsed.cloudName}/video/upload/${format}${quality}${width}${ver}/${parsed.publicId}.mp4`;
}

/**
 * Strategy B: Longer Videos — HLS Adaptive Bitrate Streaming
 * Generates an HLS streaming URL (.m3u8) using Cloudinary's streaming profile (sp_auto).
 * Enables adaptive bitrate streaming based on network bandwidth.
 */
export function getHlsStreamingUrl(
  url: string | undefined | null,
  options?: {
    profile?: string;
  }
): string | null {
  if (!url) return null;
  if (url.includes(".m3u8")) return url;

  const parsed = parseCloudinaryVideo(url);
  if (!parsed || !parsed.publicId) return null;

  const profile = options?.profile || "sp_auto";
  return `https://res.cloudinary.com/${parsed.cloudName}/video/upload/${profile}/${parsed.publicId}.m3u8`;
}

/**
 * Cloudinary Video Poster Generation
 * Extracts a lightweight, high-quality video poster image at the specified start offset (so_0).
 */
export function getVideoPosterUrl(
  url: string | undefined | null,
  options?: {
    timeOffset?: number | string;
    width?: number;
    height?: number;
    crop?: string;
  }
): string | null {
  if (!url) return null;
  const parsed = parseCloudinaryVideo(url);
  if (!parsed || !parsed.publicId) return null;

  const width = options?.width ? `,w_${options.width}` : "";
  const height = options?.height ? `,h_${options.height}` : "";
  const crop = options?.crop ? `,c_${options.crop}` : "";
  const time = options?.timeOffset !== undefined ? options.timeOffset : 0;
  const ver = parsed.version ? `/${parsed.version}` : "";

  return `https://res.cloudinary.com/${parsed.cloudName}/video/upload/so_${time},f_auto,q_auto${width}${height}${crop}${ver}/${parsed.publicId}.jpg`;
}

/**
 * Determines whether a URL is an HLS manifest (.m3u8) or standard video (.mp4/.webm/etc.).
 */
export function detectVideoFormat(url: string | undefined | null): "hls" | "mp4" | "unknown" {
  if (!url) return "unknown";
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".m3u8")) return "hls";
  if (clean.endsWith(".mp4") || clean.endsWith(".webm") || clean.endsWith(".mov")) return "mp4";
  return "unknown";
}
