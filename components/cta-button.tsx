import Link from "next/link";

const variants = {
  primary: "btn-dark",
  flame: "btn-primary",
  outline: "btn-outline",
  gold: "btn-primary"
};

type CTAButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  external?: boolean;
};

export function CTAButton({ href, children, variant = "primary", external = false }: CTAButtonProps) {
  const className = `${variants[variant]} w-full text-center text-sm sm:w-auto`;

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
