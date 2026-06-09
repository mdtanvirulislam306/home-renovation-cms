import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/landscaping-cms";

const services = [
  "Landscaping",
  "Fence Replacement",
  "Gutter & Window Cleaning",
  "Roof Cleaning",
  "Roofing Carpenter's Helper",
  "Stripping",
  "General Labour",
  "Garden Cleaning",
  "Crack Sealing & Seal Coating",
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db;
  if (!db) throw new Error("No database connection");

  await db.dropDatabase();
  console.log("Dropped existing database");

  const User = mongoose.model(
    "User",
    new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      password: String,
      role: { type: String, default: "super-admin" },
    })
  );

  const Category = mongoose.model(
    "Category",
    new mongoose.Schema({ name: String, slug: String })
  );

  const Service = mongoose.model(
    "Service",
    new mongoose.Schema({
      title: String,
      slug: String,
      shortDescription: String,
      fullDescription: String,
      keyBenefits: [String],
      featuredImage: String,
      galleryImages: [String],
      status: String,
      displayOrder: Number,
    })
  );

  const Blog = mongoose.model(
    "Blog",
    new mongoose.Schema({
      title: String,
      slug: String,
      author: String,
      category: mongoose.Schema.Types.ObjectId,
      tags: [String],
      featuredImage: String,
      excerpt: String,
      body: String,
      publishDate: Date,
      status: String,
    })
  );

  const Testimonial = mongoose.model(
    "Testimonial",
    new mongoose.Schema({
      name: String,
      role: String,
      content: String,
      rating: Number,
      status: String,
      displayOrder: Number,
    })
  );

  const CaseStudy = mongoose.model(
    "CaseStudy",
    new mongoose.Schema({
      title: String,
      slug: String,
      summary: String,
      challenge: String,
      solution: String,
      results: String,
      featuredImage: String,
      status: String,
      location: String,
    })
  );

  const Gallery = mongoose.model(
    "Gallery",
    new mongoose.Schema({ title: String, image: String, status: String, displayOrder: Number })
  );

  const Settings = mongoose.model("Settings", new mongoose.Schema({ siteName: String }));

  const hashedPassword = await bcrypt.hash("admin123", 12);
  await User.create({
    name: "Admin User",
    email: "admin@greenscape.com",
    password: hashedPassword,
    role: "super-admin",
  });
  console.log("Created admin: admin@greenscape.com / admin123");

  const categories = await Category.insertMany([
    { name: "Landscaping Tips", slug: "landscaping-tips" },
    { name: "Property Care", slug: "property-care" },
    { name: "Seasonal Guides", slug: "seasonal-guides" },
  ]);

  const img = "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800";

  await Service.insertMany(
    services.map((title, i) => ({
      title,
      slug: slugify(title, { lower: true, strict: true }),
      shortDescription: `Professional ${title.toLowerCase()} services for residential and commercial properties.`,
      fullDescription: `<p>Our expert team delivers premium <strong>${title}</strong> services with attention to detail and lasting results. We use industry-leading equipment and eco-friendly practices.</p><p>Contact us today for a free consultation and quote.</p>`,
      keyBenefits: ["Licensed & insured", "Free estimates", "Satisfaction guaranteed", "Eco-friendly methods"],
      featuredImage: img,
      galleryImages: [img],
      status: "published",
      displayOrder: i,
    }))
  );
  console.log(`Created ${services.length} services`);

  await Blog.insertMany([
    {
      title: "Spring Lawn Care Essentials",
      slug: "spring-lawn-care-essentials",
      author: "GreenScape Team",
      category: categories[0]._id,
      tags: ["lawn", "spring"],
      featuredImage: img,
      excerpt: "Prepare your lawn for the growing season with these expert tips.",
      body: "<p>Spring is the perfect time to revitalize your lawn. Start with aeration, overseeding, and proper fertilization.</p>",
      publishDate: new Date(),
      status: "published",
    },
    {
      title: "How to Maintain Your Fence Year-Round",
      slug: "fence-maintenance-guide",
      author: "GreenScape Team",
      category: categories[1]._id,
      tags: ["fence", "maintenance"],
      featuredImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      excerpt: "Keep your fence looking great and lasting longer with proper care.",
      body: "<p>Regular cleaning, staining, and inspection prevent costly repairs down the road.</p>",
      publishDate: new Date(),
      status: "published",
    },
  ]);
  console.log("Created blog posts");

  await Testimonial.insertMany([
    { name: "Sarah Johnson", role: "Homeowner", content: "GreenScape transformed our backyard completely. Professional, on-time, and beautiful results!", rating: 5, status: "published", displayOrder: 0 },
    { name: "Mike Chen", role: "Property Manager", content: "We use GreenScape for all our commercial properties. Reliable and excellent quality.", rating: 5, status: "published", displayOrder: 1 },
    { name: "Emily Davis", role: "Homeowner", content: "Best landscaping company in the area. Fair pricing and outstanding craftsmanship.", rating: 5, status: "published", displayOrder: 2 },
  ]);

  await CaseStudy.insertMany([
    {
      title: "Modern Backyard Transformation",
      slug: "modern-backyard-transformation",
      summary: "Complete backyard redesign with native plants and modern hardscaping.",
      challenge: "<p>The client had an overgrown, unusable backyard with poor drainage.</p>",
      solution: "<p>We redesigned the space with proper grading, native plantings, and a stone patio.</p>",
      results: "<p>300% increase in usable outdoor space. Client reported 40% reduction in water usage.</p>",
      featuredImage: img,
      status: "published",
      location: "Green Valley, CA",
    },
  ]);

  await Gallery.insertMany([
    { title: "Garden Renovation", image: img, status: "published", displayOrder: 0 },
    { title: "Fence Installation", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", status: "published", displayOrder: 1 },
  ]);

  await Settings.create({
    siteName: "GreenScape Pro",
    tagline: "Premium Landscaping & Property Services",
    phone: "+1 (555) 123-4567",
    email: "hello@greenscapepro.com",
    address: "123 Garden Lane, Green Valley, CA 90210",
  });

  console.log("Seed completed successfully!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
