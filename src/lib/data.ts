import { connectDB } from "@/lib/db";
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
  return query.lean();
}

export async function getServiceBySlug(slug: string) {
  await connectDB();
  return Service.findOne({ slug, status: "published" }).lean();
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

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getBlogBySlug(slug: string) {
  await connectDB();
  return Blog.findOne({ slug, status: "published" })
    .populate("category", "name slug")
    .lean();
}

export async function getRelatedBlogs(categoryId: string, excludeSlug: string, limit = 3) {
  await connectDB();
  return Blog.find({
    category: categoryId,
    slug: { $ne: excludeSlug },
    status: "published",
  })
    .sort({ publishDate: -1 })
    .limit(limit)
    .populate("category", "name slug")
    .lean();
}

export async function getCategories() {
  await connectDB();
  return Category.find().sort({ name: 1 }).lean();
}

export async function getPublishedGallery() {
  await connectDB();
  return Gallery.find({ status: "published" }).sort({ displayOrder: 1 }).lean();
}

export async function getPublishedTestimonials() {
  await connectDB();
  return Testimonial.find({ status: "published" }).sort({ displayOrder: 1 }).lean();
}

export async function getPublishedCaseStudies(limit?: number) {
  await connectDB();
  const query = CaseStudy.find({ status: "published" }).sort({ createdAt: -1 });
  if (limit) query.limit(limit);
  return query.lean();
}

export async function getCaseStudyBySlug(slug: string) {
  await connectDB();
  return CaseStudy.findOne({ slug, status: "published" }).lean();
}

export async function getSettings() {
  await connectDB();
  let settings = await Settings.findOne().lean();
  if (!settings) {
    const created = await Settings.create({});
    settings = created.toObject();
  }
  return settings;
}
