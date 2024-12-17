import { useWeatherData } from "@/hooks/useWeatherData";


const {forecast} = useWeatherData();

export const useForecast = () => {
  const uniqueDates = [
    ...new Set(
      forecast?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];
  // Filtering data to get the first entry after 6 AM for each unique date
  const firstDataForEachDate = uniqueDates.map((date) => {
    return forecast?.list.find((entry) => {
      const entryDate = new Date((entry.dt) * 1000).toISOString().split("T")[0];
      const entryTime = new Date((entry.dt) * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });
  
  

  return {firstDataForEachDate};

}



