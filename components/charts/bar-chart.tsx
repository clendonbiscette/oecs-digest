"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

interface BarChartProps {
  data: any[]
  xKey: string
  yKeys: string[]
  title?: string
  colors?: string[]
}

export function CustomBarChart({
  data,
  xKey,
  yKeys,
  title,
  colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"],
}: BarChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} angle={-45} textAnchor="end" height={100} fontSize={12} />
          <YAxis />
          <Tooltip />
          <Legend />
          {yKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              name={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
