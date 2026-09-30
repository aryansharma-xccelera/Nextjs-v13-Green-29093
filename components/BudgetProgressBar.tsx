import { BudgetStatus } from "@/types";

interface BudgetProgressBarProps {
  utilization: number;
  status: BudgetStatus;
}

const BAR_COLOR: Record<BudgetStatus, string> = {
  "no-budget": "bg-border",
  ok: "bg-success",
  warning: "bg-warning",
  exceeded: "bg-danger",
};

export function BudgetProgressBar({ utilization, status }: BudgetProgressBarProps) {
  const width = Math.min(Math.max(utilization, 0), 100);

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
      <div
        className={`h-full rounded-full transition-all ${BAR_COLOR[status]}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function budgetStatusLabel(status: BudgetStatus): string {
  switch (status) {
    case "exceeded":
      return "Over budget";
    case "warning":
      return "Nearing limit";
    case "ok":
      return "On track";
    default:
      return "No budget set";
  }
}

export function budgetStatusTextClass(status: BudgetStatus): string {
  switch (status) {
    case "exceeded":
      return "text-danger";
    case "warning":
      return "text-warning";
    case "ok":
      return "text-success";
    default:
      return "text-text-secondary";
  }
}
