export const siteConfig = {
  name: "GreenScape Pro",
  description:
    "Premium landscaping and property services — expert lawn care, fencing, roof cleaning, and more across your local area.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  links: {
    phone: "+1 (555) 123-4567",
    email: "hello@greenscapepro.com",
    address: "123 Garden Lane, Green Valley, CA 90210",
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  services: [
    "Landscaping",
    "Fence Replacement",
    "Gutter & Window Cleaning",
    "Roof Cleaning",
    "Roofing Carpenter's Helper",
    "Stripping",
    "General Labour",
    "Garden Cleaning",
    "Crack Sealing & Seal Coating",
  ],
  stats: [
    { label: "Projects Completed", value: 2500, suffix: "+" },
    { label: "Happy Clients", value: 1800, suffix: "+" },
    { label: "Years Experience", value: 15, suffix: "+" },
    { label: "Team Members", value: 45, suffix: "+" },
  ],
} as const;
