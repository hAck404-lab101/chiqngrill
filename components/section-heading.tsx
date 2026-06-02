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
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="app-title mt-3 text-4xl md:text-6xl">{title}</h2>
      {description ? <p className="mt-4 text-base font-medium leading-7 text-[var(--ink-soft)] md:text-lg">{description}</p> : null}
    </div>
  );
}
