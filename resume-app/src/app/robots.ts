import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resume-app-ten-nu.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/templates", "/privacy", "/terms", "/login", "/signup"],
        disallow: ["/dashboard/", "/api/", "/auth/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
