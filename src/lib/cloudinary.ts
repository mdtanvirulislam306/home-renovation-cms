import { v2 as cloudinary } from "cloudinary";

const PLACEHOLDER_VALUES = new Set(["your_cloud_name", "your_api_key", "your_api_secret"]);

function isValidCredential(value: string | undefined): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed || PLACEHOLDER_VALUES.has(trimmed)) return false;
  // Reject masked/placeholder secrets like **********
  if (/^[*•.]+$/.test(trimmed)) return false;
  return true;
}

export function isCloudinaryConfigured(): boolean {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  return Boolean(
    isValidCredential(cloudName) &&
      isValidCredential(apiKey) &&
      apiSecret &&
      apiSecret.length >= 20 &&
      isValidCredential(apiSecret)
  );
}

function ensureConfig() {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export { cloudinary };

export async function uploadImage(
  file: string,
  folder = "landscaping-cms"
): Promise<{ url: string; publicId: string }> {
  ensureConfig();
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "image",
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
