type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-sm font-bold uppercase tracking-[0.35em] text-flame">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-lg leading-8 text-cream/70">{description}</p> : null}
    </div>
  );
}
