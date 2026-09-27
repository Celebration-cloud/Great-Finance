export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return <header className="flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">{eyebrow}</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">{title}</h1>{description && <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">{description}</p>}</div>{action}</header>;
}

export function MetricGrid({ items }: { items: Array<{ label: string; value: React.ReactNode; detail?: React.ReactNode }> }) {
  return (
    <dl className="mt-8 grid gap-px overflow-hidden rounded-[1.35rem] bg-[var(--line)] sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div className="bg-[var(--surface)] p-6" key={item.label}>
          <dt className="text-sm font-medium text-[var(--muted)]">{item.label}</dt>
          <dd className="mt-2 text-2xl font-bold tracking-tight text-[var(--ink)] tabular-nums">{item.value}</dd>
          {item.detail && <p className="mt-1 text-xs text-[var(--muted)]">{item.detail}</p>}
        </div>
      ))}
    </dl>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="p-10 text-center"><p className="font-bold text-[var(--ink)]">{title}</p><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">{description}</p></div>;
}

export function DataTable({ columns, children }: { columns: string[]; children?: React.ReactNode }) {
  return <div className="mt-8 overflow-x-auto rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface)]"><table className="min-w-full text-left text-sm"><thead className="bg-[var(--surface-muted)] text-[var(--muted)]"><tr>{columns.map((column) => <th className="px-5 py-4 font-semibold" key={column}>{column}</th>)}</tr></thead><tbody className="divide-y divide-[var(--line)]">{children}</tbody></table></div>;
}
