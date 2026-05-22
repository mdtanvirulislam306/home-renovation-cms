import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Service, Blog, Inquiry, CaseStudy, Testimonial } from "@/models";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  try {
    await connectDB();

    const [
      totalServices,
      totalBlogs,
      totalInquiries,
      newInquiries,
      totalCaseStudies,
      totalTestimonials,
      recentInquiries,
    ] = await Promise.all([
      Service.countDocuments(),
      Blog.countDocuments(),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: "new" }),
      CaseStudy.countDocuments(),
      Testimonial.countDocuments(),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const inquiryTrend = await Inquiry.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return apiSuccess({
      stats: {
        totalServices,
        totalBlogs,
        totalInquiries,
        newInquiries,
        totalCaseStudies,
        totalTestimonials,
      },
      inquiryTrend,
      recentInquiries,
    });
  } catch {
    return apiError("Failed to fetch dashboard stats", 500);
  }
}
