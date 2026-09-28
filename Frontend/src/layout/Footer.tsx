import { RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { DELIVERY_FEE, FREE_DELIVERY_FROM, formatNaira } from '../data';
import { Logo } from './Logo';

const PERKS = [
  { icon: Truck, title: 'Nationwide delivery', body: `${formatNaira(DELIVERY_FEE)} flat rate, free over ${formatNaira(FREE_DELIVERY_FROM)}.` },
  { icon: RotateCcw, title: '7-day returns', body: 'Changed your mind? Send it back unused for a refund.' },
  { icon: ShieldCheck, title: 'Secure payments', body: 'Cards, transfers and USSD, handled by Paystack.' },
];

export function Footer() {
  return (
    <footer id="help" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-3">
        {PERKS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-tint text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold">{title}</h3>
              <p className="mt-0.5 text-sm text-muted">{body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted sm:flex-row sm:px-6">
          <Logo />
          <p>© {new Date().getFullYear()} malikshops. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
