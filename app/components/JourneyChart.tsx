"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";

interface JourneyDataPoint {
  name: string;
  health: number;
  pincaliReady: number;
}

interface JourneyChartProps {
  data: JourneyDataPoint[];
}

export default function JourneyChart({ data }: JourneyChartProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2A2EBE" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2A2EBE" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value, name) => {
              if (name === "health") return [`${value}%`, "Calidad"];
              return [value, "Pincali Ready"];
            }}
          />
          <ReferenceArea y1={0} y2={60} fill="#ef4444" fillOpacity={0.04} />
          <ReferenceArea y1={60} y2={80} fill="#eab308" fillOpacity={0.04} />
          <ReferenceArea y1={80} y2={100} fill="#22c55e" fillOpacity={0.04} />
          <ReferenceLine
            y={80}
            stroke="#9ca3af"
            strokeDasharray="4 4"
            label={{ value: "Estandar marketplace", position: "right", fontSize: 11, fill: "#6b7280" }}
          />
          <Area
            type="monotone"
            dataKey="health"
            stroke="#2A2EBE"
            strokeWidth={2}
            fill="url(#healthGradient)"
            dot={{ r: 5, fill: "#2A2EBE", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 7 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-between px-4 mt-2">
        {data.map((point) => (
          <span key={point.name} className="text-xs text-gray-500">
            {point.pincaliReady} Pincali Ready
          </span>
        ))}
      </div>
      <p className="text-[11px] text-gray-400 mt-3 text-center">
        Threshold &ge;80% basado en estándar de calidad (LQS).
      </p>
    </div>
  );
}
