import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export function MetricChart({ value, label }: { value: number; label: string }) {
  const normalized = Math.min(100, Math.max(0, value));
  const data = [{ value: normalized }, { value: 100 - normalized }];
  return (
    <div className="relative h-36" aria-label={`${label}: ${normalized}%`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" startAngle={210} endAngle={-30} innerRadius={48} outerRadius={59} stroke="none" isAnimationActive>
            <Cell fill="currentColor" className="text-ink-900 dark:text-white" />
            <Cell fill="currentColor" className="text-ink-200 dark:text-ink-800" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-3"><span className="text-2xl font-medium">{Math.round(normalized)}%</span><span className="mt-1 text-[10px] uppercase tracking-wider text-ink-400">{label}</span></div>
    </div>
  );
}
