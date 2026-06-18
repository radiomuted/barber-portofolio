import { getPublicContent } from "@/lib/data";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { HeaderNav } from "@/app/admin/header-nav";

export default async function Home() {
  const { profile, services, gallery, testimonials } = await getPublicContent();
  const name = profile?.name ?? "Ahmad Farid Setiawan";
  const tagline = profile?.tagline ?? "Precision Cuts. Timeless Style.";
  const phone = profile?.phone ?? "+62 8xx-xxxx-xxxx";

  return (
    <main className="flex-1">
      <HeaderNav />
      <HeroSection
        name={name}
        tagline={tagline}
        avatarUrl={profile?.avatarUrl}
        experience={profile?.experience ?? 0}
        clients={profile?.clients ?? 0}
        styles={profile?.styles ?? 0}
      />

      <AboutSection
        bio={
          profile?.bio ??
          "Ahmad Farid Setiawan adalah barber yang berfokus pada detail, presisi, dan kenyamanan pelanggan."
        }
        experience={profile?.experience ?? 0}
        clients={profile?.clients ?? 0}
        styles={profile?.styles ?? 0}
        aboutImageUrl={profile?.aboutImageUrl}
      />

      <ServicesSection services={services} />

      <GallerySection items={gallery} />

      <TestimonialsSection items={testimonials} />

      <ContactSection
        phoneE164={phone}
        instagram={profile?.instagram}
        linkedin={profile?.linkedin}
      />

      <FooterSection
        name={name}
        tagline={tagline}
        instagram={profile?.instagram}
        tiktok={profile?.tiktok}
        facebook={profile?.facebook}
      />
    </main>
  );
}
