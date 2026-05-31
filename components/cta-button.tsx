import Link from "next/link";

const variants = {
  primary: "bg-cream text-charcoal hover:bg-gold",
  flame: "bg-flame text-charcoal hover:bg-gold",
  outline: "border border-cream/25 text-cream hover:border-gold hover:text-gold",
  gold: "border border-gold/40 text-gold hover:bg-gold hover:text-charcoal"
};

type CTAButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  external?: boolean;
};

export function CTAButton({ href, children, variant = "primary", external = false }: CTAButtonProps) {
  const className = `rounded-full px-7 py-4 text-center font-black transition hover:scale-[1.02] ${variants[variant]}`;

  if (external || href.startsWith("tel:") || href.startsWith("https://wa.me")) {
    return (
      <a href={href} className={className} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
