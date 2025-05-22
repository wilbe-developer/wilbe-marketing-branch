
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DailySignupsChartProps {
  data: Array<{
    date: string;
    waitlist: number;
    sprint: number;
    total: number;
  }>;
}

const DailySignupsChart: React.FC<DailySignupsChartProps> = ({ data }) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="waitlist" stroke="#8884d8" name="Waitlist" />
          <Line type="monotone" dataKey="sprint" stroke="#82ca9d" name="Sprint" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailySignupsChart;
