"use client";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function PageHeader({ title, description, actions, eyebrow }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="text-eyebrow mb-1">{eyebrow}</p> : null}
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, hint, trend, tone = "default" }) {
  const toneRing = {
    default: "bg-secondary/10 text-secondary",
    success: "bg-success/12 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    danger: "bg-destructive/10 text-destructive",
    accent: "bg-accent/12 text-accent",
  }[tone];

  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", toneRing)}>
          <Icon className="size-4.5" aria-hidden />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{value}</p>
      {hint || trend ? (
        <p className="mt-1 text-xs text-muted-foreground">
          {trend ? <span className="font-semibold text-success">{trend}</span> : null}
          {trend && hint ? " · " : null}
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function SectionCard({ title, description, action, children, className, contentClassName }) {
  return (
    <section className={cn("surface flex flex-col", className)}>
      <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-bold text-foreground">{title}</h2>
          {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </header>
      <div className={cn("p-5", contentClassName)}>{children}</div>
    </section>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-12 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function LoadingRows({ rows = 5 }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-full" />
      ))}
    </div>
  );
}

export function StatGrid({ children }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

export function DetailList({ items }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs font-medium text-muted-foreground">{item.label}</dt>
          <dd className="mt-0.5 text-sm font-semibold text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Timeline({ items }) {
  return (
    <ol className="relative space-y-5 border-l border-border pl-5">
      {items.map((item, i) => (
        <li key={`${item.label}-${i}`} className="relative">
          <span
            className={cn(
              "absolute -left-[26px] top-1 size-3 rounded-full border-2 border-card",
              item.done === false ? "bg-border" : "bg-accent",
            )}
            aria-hidden
          />
          <p className={cn("text-sm font-semibold", item.done === false ? "text-muted-foreground" : "text-foreground")}>
            {item.label}
          </p>
          {item.date ? <p className="text-xs text-muted-foreground">{item.date}</p> : null}
          {item.note ? <p className="mt-1 text-xs text-muted-foreground">{item.note}</p> : null}
        </li>
      ))}
    </ol>
  );
}
