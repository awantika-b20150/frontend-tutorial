import { Chart } from '@/types/ChartType';
import { format, parseISO } from "date-fns";
import { extractForecast } from './extractForecast';
import { WeatherData } from '@/types/ForecastWeatherType';

export function extractChart(data:WeatherData | undefined){
    const firstDataForEachDate = extractForecast(data);
    const chart_temp = new Array<Chart>;
    firstDataForEachDate.map((d) => 
    chart_temp.push({
        temp:(Math.floor(d?.main.temp ?? 0)),
        dates: (d ? format(parseISO(d.dt_txt), "dd.MM") : "")
    }
    ));
    return chart_temp;
}