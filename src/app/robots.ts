import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/cart/", "/login/", "/account/", "/api/"],
      },
    ],
    sitemap: "https://www.gamajewels.com/sitemap.xml",
  };
}
