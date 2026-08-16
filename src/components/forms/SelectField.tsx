interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
  hint?: string;
  id: string;
}

export default function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  hint,
  id,
}: SelectFieldProps<T>) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink/80">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="mt-1.5 w-full rounded-sm border border-sage/40 bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-gold"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-xs text-ink/50">{hint}</p>}
    </div>
  );
}
