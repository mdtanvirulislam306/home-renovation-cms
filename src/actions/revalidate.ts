"use server";

import { revalidatePath } from "next/cache";

export async function revalidateServices() {
  revalidatePath("/services");
  revalidatePath("/");
}

export async function revalidateBlogs() {
  revalidatePath("/blog");
  revalidatePath("/");
}

export async function revalidateCaseStudies() {
  revalidatePath("/case-studies");
  revalidatePath("/");
}
