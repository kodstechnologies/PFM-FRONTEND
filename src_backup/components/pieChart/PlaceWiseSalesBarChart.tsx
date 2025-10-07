import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

type Props = {
  data: { place: string; total: number }[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  const isVisible = active && payload && payload.length;
  return (
    <div
      className="custom-tooltip bg-white p-3 shadow rounded border"
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      {isVisible && (
        <>
          <p className="font-semibold">{`${label} Orders: ${payload[0].value}`}</p>
          <p className="text-gray-500">Place-wise total order count</p>
        </>
      )}
    </div>
  );
};

const PlaceWiseSalesChart: React.FC<Props> = ({ data }) => {
  return (

    <ResponsiveContainer width="100%" height={400}>
  <BarChart
    data={data}
    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
  >
    <defs>
      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A4BC92" />   {/* Light blue */}
        <stop offset="100%" stopColor="#A4BC92" /> {/* Darker blue */}
      </linearGradient>
    </defs>

    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="place" />
    <YAxis />
    <Tooltip content={CustomTooltip} />
    <Legend />
    <Bar dataKey="total" fill="url(#barGradient)" barSize={40}>
      <LabelList dataKey="total" position="top" />
    </Bar>
  </BarChart>
</ResponsiveContainer>

  
  );
};

export default PlaceWiseSalesChart;
