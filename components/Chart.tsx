import { Chart } from '@/types/ChartType';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,Legend } from 'recharts';

interface ChartProps {
    data: Array<Chart>;
  
}
export default function ForecastChart({data}:ChartProps){
  return(
    <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Line type="monotone" dataKey="temp" stroke="#8884d8" />
        <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
        <Line type="monotone" dataKey="speed" stroke="#80461B" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="dates" />
        <YAxis />
        <Tooltip />
        <Legend />
        </LineChart>
  );

}


