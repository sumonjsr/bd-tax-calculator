interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
  prefix?: string;
  min?: number;
  id: string;
}

export default function NumberField({
  label,
  value,
  onChange,
  hint,
  prefix = "৳",
  min = 0,
  id,
}: NumberFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink/80">
        {label}
      </label>
      <div className="mt-1.5 flex items-center rounded-sm border border-sage/40 bg-paper focus-within:border-gold">
        <span className="pl-3 font-data text-sm text-ink/50">{prefix}</span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          value={value === 0 ? "" : value}
          placeholder="0"
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className="w-full bg-transparent px-2 py-2.5 font-data text-sm text-ink outline-none"
        />
      </div>
      {hint && <p className="mt-1 text-xs text-ink/50">{hint}</p>}
    </div>
  );
}
