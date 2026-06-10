export function getYouTubeVideoId(url: string): string | null {
  if (!url?.trim()) return null;

  try {
    const parsed = new URL(url.trim());

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id || null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/")[2] || null;
      }
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/")[2] || null;
      }
      const v = parsed.searchParams.get("v");
      return v || null;
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeEmbedUrl(url: string, autoplay = true): string | null {
  const id = getYouTubeVideoId(url);
  if (!id) return null;

  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });

  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}
