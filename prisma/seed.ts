import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.profile.upsert({
    where: { id: "profile" },
    update: {},
    create: {
      id: "profile",
      bio: "Ahmad Farid Setiawan adalah barber yang berfokus pada detail, presisi, dan kenyamanan pelanggan. Dari potongan klasik hingga fade modern, setiap layanan dikerjakan dengan teknik rapi dan gaya yang timeless.",
      experience: 7,
      clients: 420,
      styles: 18,
      phone: "+62 8xx-xxxx-xxxx",
      instagram: "https://instagram.com/",
      linkedin: "https://linkedin.com/",
      tiktok: "https://tiktok.com/",
      facebook: "https://facebook.com/",
    },
  });

  const services = [
    {
      title: "Classic Haircut",
      description: "Potongan klasik yang bersih, proporsional, dan sesuai bentuk wajah.",
      price: "Mulai dari Rp 50.000",
      order: 1,
      icon: "scissors",
    },
    {
      title: "Fade & Taper",
      description: "Fade halus dan presisi dengan transisi yang mulus.",
      price: "Mulai dari Rp 65.000",
      order: 2,
      icon: "sparkles",
    },
    {
      title: "Beard Trim & Shaping",
      description: "Rapikan dan bentuk jenggot agar terlihat tegas dan rapi.",
      price: "Mulai dari Rp 40.000",
      order: 3,
      icon: "beard",
    },
    {
      title: "Hair Coloring",
      description: "Pewarnaan rambut dengan hasil natural atau bold sesuai request.",
      price: "Mulai dari Rp 150.000",
      order: 4,
      icon: "palette",
    },
    {
      title: "Hot Towel Shave",
      description: "Ritual cukur dengan handuk hangat untuk hasil yang halus.",
      price: "Mulai dari Rp 60.000",
      order: 5,
      icon: "droplet",
    },
    {
      title: "Kids Haircut",
      description: "Potongan nyaman untuk anak, rapi dan cepat.",
      price: "Mulai dari Rp 40.000",
      order: 6,
      icon: "smile",
    },
  ];

  // Ensure deterministic seed for services/gallery/testimonials
  await prisma.service.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.testimonial.deleteMany();

  await prisma.service.createMany({ data: services });

  const categories = ["fade", "classic", "beard"] as const;
  const gallery = Array.from({ length: 12 }).map((_, i) => {
    const cat = categories[i % categories.length];
    return {
      imageUrl: `/uploads/placeholder.svg`,
      category: cat,
      caption: `Style ${i + 1}`,
      order: i + 1,
    };
  });
  await prisma.galleryItem.createMany({ data: gallery });

  await prisma.testimonial.createMany({
    data: [
      {
        author: "Rizky",
        rating: 5,
        review: "Fade-nya rapi banget dan tahan lama. Tempatnya nyaman.",
        order: 1,
        published: true,
      },
      {
        author: "Dimas",
        rating: 5,
        review: "Detailnya juara. Potongan klasik jadi terlihat lebih modern.",
        order: 2,
        published: true,
      },
      {
        author: "Andi",
        rating: 4,
        review: "Beard shaping-nya pas, hasilnya clean dan natural.",
        order: 3,
        published: true,
      },
      {
        author: "Fajar",
        rating: 5,
        review: "Hot towel shave bikin rileks. Recommended!",
        order: 4,
        published: true,
      },
      {
        author: "Bima",
        rating: 5,
        review: "Komunikatif dan ngerti style yang cocok. Mantap.",
        order: 5,
        published: true,
      },
    ],
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

