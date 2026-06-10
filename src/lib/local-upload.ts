import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function uploadImageLocal(
  file: string,
  folder = "landscaping-cms"
): Promise<{ url: string; publicId: string }> {
  const matches = file.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid image format. Please upload a valid image file.");
  }

  const mimeType = matches[1].toLowerCase();
  const buffer = Buffer.from(matches[2], "base64");
  const ext = MIME_TO_EXT[mimeType] || "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const safeFolder = folder.replace(/[^a-zA-Z0-9-_]/g, "");
  const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return {
    url: `/uploads/${safeFolder}/${filename}`,
    publicId: `${safeFolder}/${filename}`,
  };
}
