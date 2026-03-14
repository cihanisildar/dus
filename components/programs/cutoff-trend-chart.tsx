"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface CutoffHistoryEntry {
  year: number
  period: string | null
  cutoffScore: number
}

interface CutoffTrendChartProps {
  history: CutoffHistoryEntry[]
  programName: string
}

export function CutoffTrendChart({ history, programName }: CutoffTrendChartProps) {
  if (!history || history.length === 0) return null

  const data = history
    .sort((a, b) => a.year - b.year)
    .map(h => ({
      year: h.year,
      puan: h.cutoffScore / 100, // Convert back to decimal
    }))

  const minScore = Math.min(...data.map(d => d.puan)) - 2
  const maxScore = Math.max(...data.map(d => d.puan)) + 2

  return (
    <div className="mt-3">
      <p className="text-xs text-gray-500 mb-2 font-medium">Taban Puan Trendi (Son 4 Yıl)</p>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 10, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[minScore, maxScore]}
            tick={{ fontSize: 10, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(2)}`, 'Taban Puan']}
            labelFormatter={(label) => `${label} Yılı`}
            contentStyle={{ fontSize: 11, padding: '4px 8px' }}
          />
          <Line
            type="monotone"
            dataKey="puan"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3, fill: '#3b82f6' }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
