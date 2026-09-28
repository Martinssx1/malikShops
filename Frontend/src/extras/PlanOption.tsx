import { Check } from 'lucide-react';

export function PlanOption({
  selected,
  disabled,
  onSelect,
  title,
  detail,
  note,
}: {
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
  title: string;
  detail: string;
  note?: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
        selected ? 'border-brand bg-tint' : 'border-line bg-surface'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-brand/60'}`}
    >
      <input type="radio" name="plan" className="sr-only" checked={selected} disabled={disabled} onChange={onSelect} />
      <span
        aria-hidden
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? 'border-brand bg-brand text-brand-ink' : 'border-line'
        }`}
      >
        {selected && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-bold">{title}</span>
        {note && <span className="block text-xs text-muted">{note}</span>}
      </span>
      <span className="text-sm font-bold">{detail}</span>
    </label>
  );
}
