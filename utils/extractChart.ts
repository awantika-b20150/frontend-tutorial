import { Chart } from '@/types/ChartType';
import { format, parseISO } from "date-fns";
import { useForecast } from '@/features/hooks/useForecast';

export function extractChart(){
    const {firstDataForEachDate} = useForecast();
    const chart_temp = new Array<Chart>;
    firstDataForEachDate.map((d) => 
    chart_temp.push({
        temp:(Math.floor(d?.main.temp ?? 0)),
        dates: (d ? format(parseISO(d.dt_txt), "dd.MM") : "")
    }
    ));
    return chart_temp;
}