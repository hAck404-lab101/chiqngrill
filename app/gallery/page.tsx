import { AppHeader } from "@/components/app-header";
import { CTAButton } from "@/components/cta-button";
import { SectionHeading } from "@/components/section-heading";
import { restaurant } from "@/lib/restaurant-data";

const galleryItems = [
  { title: "Golden Chicken", mood: "Crispy · Juicy · Bold", tall: true },
  { title: "Jollof Plates", mood: "Comfort · Rich · Accra" },
  { title: "Herb Butter Rice", mood: "Smooth · Warm" },
  { title: "Fries & Sides", mood: "Quick · Crunchy" },
  { title: "Interior Mood", mood: "Serene · Music", tall: true },
  { title: "Drinks & Chill", mood: "Cold · Relaxed" }
];

export default function GalleryPage() {
  return (
    <main className="app-page">
      <AppHeader />

      <section className="app-container py-8 md:py-12">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <SectionHeading
            eyebrow="Gallery"
            title="See the food and vibe"
            description="A simple visual space for food photos, interior shots, drinks, and table moments."
          />
          <CTAButton href="/menu" variant="flame">Order Food</CTAButton>
        </div>

        <div className="mt-7 grid auto-rows-[14rem] gap-4 md:grid-cols-3">
          {galleryItems.map((item) => (
            <article key={item.title} className={`surface overflow-hidden p-3 ${item.tall ? "md:row-span-2" : ""}`}>
              <div className="food-tile h-full min-h-full" />
              <div className="px-1 pt-4">
                <h2 className="text-xl font-black">{item.title}</h2>
                <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{item.mood}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="surface mt-7 p-5 md:p-7">
          <h2 className="text-2xl font-black">Before client presentation</h2>
          <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[var(--muted)]">
            Replace these placeholders with real Chiq-N-Grill photos: chicken closeups, jollof plates, fries, drinks, seating, and customer table moments.
          </p>
          <div className="mt-5 grid gap-3 sm:flex">
            <CTAButton href={restaurant.mapsUrl} variant="outline" external>Open Maps</CTAButton>
            <CTAButton href={restaurant.phoneHref} variant="flame">Call Restaurant</CTAButton>
          </div>
        </div>
      </section>
    </main>
  );
}
