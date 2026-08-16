import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="rounded-sm border border-sage/30 bg-paper p-6">
      <h3 className="font-display text-lg text-ink">{title}</h3>
      {description && <p className="mt-1 text-sm text-ink/60">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </div>
  );
}
