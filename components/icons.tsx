type IconProps = {
  className?: string;
};

const base = "size-5";

export function HomeIcon({ className = base }: IconProps) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 10.7 12 3.5l8.5 7.2"/><path d="M5.5 9.5V20h13V9.5"/><path d="M9.5 20v-6h5v6"/></svg>;
}

export function MenuIcon({ className = base }: IconProps) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 6h14"/><path d="M5 12h14"/><path d="M5 18h14"/></svg>;
}

export function CartIcon({ className = base }: IconProps) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 7.5h14l-1.4 8.1a2 2 0 0 1-2 1.7H9.3a2 2 0 0 1-2-1.6L5.7 4.8H3.5"/><path d="M9 20.3h.01"/><path d="M17 20.3h.01"/></svg>;
}

export function CalendarIcon({ className = base }: IconProps) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3.5v3"/><path d="M17 3.5v3"/><path d="M4.5 9h15"/><path d="M6.5 5.5h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z"/></svg>;
}

export function TrackIcon({ className = base }: IconProps) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s6-5.1 6-11a6 6 0 0 0-12 0c0 5.9 6 11 6 11Z"/><path d="M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"/></svg>;
}

export function PhoneIcon({ className = base }: IconProps) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 4.5 10 7 8.2 9.3c.8 1.7 2.8 3.7 4.5 4.5L15 12l2.5 2.5-1.3 3.2c-.3.8-1.2 1.3-2 1.1-5.1-1.1-8.9-4.9-10-10-.2-.8.3-1.7 1.1-2l3.2-1.3Z"/></svg>;
}

export function SearchIcon({ className = base }: IconProps) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/><path d="m20 20-4-4"/></svg>;
}

export function FilterIcon({ className = base }: IconProps) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>;
}

export function CashIcon({ className = base }: IconProps) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7.5h16v9H4z"/><path d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M7 10h.01"/><path d="M17 14h.01"/></svg>;
}

export function MobileMoneyIcon({ className = base }: IconProps) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3.5h8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z"/><path d="M10 17.5h4"/><path d="M9.5 8.5h5"/><path d="M9.5 11.5H13"/></svg>;
}

export function CheckIcon({ className = base }: IconProps) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.2 4.2L19.5 6.5"/></svg>;
}
