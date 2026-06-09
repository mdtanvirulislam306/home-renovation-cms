import { connectDB } from "@/lib/db";
import { serializeForClient } from "@/lib/mongoose-utils";
import type { CategoryItem } from "@/types/content";
import {
  Service,
  Blog,
  Category,
  Gallery,
  Testimonial,
  CaseStudy,
  Settings,
} from "@/models";

export async function getPublishedServices(limit?: number) {
  await connectDB();
  const query = Service.find({ status: "published" }).sort({ displayOrder: 1 });
  if (limit) query.limit(limit);
  return serializeForClient(await query.lean());
}

export async function getServiceBySlug(slug: string) {
  await connectDB();
  return serializeForClient(
    await Service.findOne({ slug, status: "published" }).lean()
  );
}

export async function getPublishedBlogs(params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}) {
  await connectDB();
  const page = params?.page || 1;
  const limit = params?.limit || 9;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { status: "published" };
  if (params?.category) filter.category = params.category;
  if (params?.search) {
    filter.$or = [
      { title: { $regex: params.search, $options: "i" } },
      { excerpt: { $regex: params.search, $options: "i" } },
    ];
  }

  const [data, total] = await Promise.all([
    Blog.find(filter)
      .populate("category", "name slug")
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(filter),
  ]);

  return serializeForClient({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

export async function getBlogBySlug(slug: string) {
  await connectDB();
  return serializeForClient(
    await Blog.findOne({ slug, status: "published" })
      .populate("category", "name slug")
      .lean()
  );
}

export async function getRelatedBlogs(categoryId: string, excludeSlug: string, limit = 3) {
  await connectDB();
  return serializeForClient(
    await Blog.find({
      category: categoryId,
      slug: { $ne: excludeSlug },
      status: "published",
    })
      .sort({ publishDate: -1 })
      .limit(limit)
      .populate("category", "name slug")
      .lean()
  );
}

export async function getCategories(): Promise<CategoryItem[]> {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).lean();
  return categories.map((cat) => ({
    _id: String(cat._id),
    name: cat.name,
    slug: cat.slug,
  }));
}

export async function getPublishedGallery() {
  await connectDB();
  return serializeForClient(
    await Gallery.find({ status: "published" }).sort({ displayOrder: 1 }).lean()
  );
}

export async function getPublishedTestimonials() {
  await connectDB();
  return serializeForClient(
    await Testimonial.find({ status: "published" }).sort({ displayOrder: 1 }).lean()
  );
}

export async function getPublishedCaseStudies(limit?: number) {
  await connectDB();
  const query = CaseStudy.find({ status: "published" }).sort({ createdAt: -1 });
  if (limit) query.limit(limit);
  return serializeForClient(await query.lean());
}

export async function getCaseStudyBySlug(slug: string) {
  await connectDB();
  return serializeForClient(
    await CaseStudy.findOne({ slug, status: "published" }).lean()
  );
}

export async function getSettings() {
  await connectDB();
  let settings = await Settings.findOne().lean();
  if (!settings) {
    await Settings.create({});
    settings = await Settings.findOne().lean();
  }
  return serializeForClient(settings);
}
