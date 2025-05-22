
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface UTMPieChartProps {
  data: Array<{ name: string; value: number }>;
  colors: string[];
}

const UTMPieChart: React.FC<UTMPieChartProps> = ({ data, colors }) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          {/* Legend removed as requested to prevent clash with labels */}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UTMPieChart;
