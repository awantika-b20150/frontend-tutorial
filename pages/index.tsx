'use client';
import { MdOutlineLocationOn, MdWbSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import { WiHumidity,WiStrongWind } from "react-icons/wi";
import  ForecastWeatherDetail  from "@/components/ForecastWeatherDetails";
import { format, parseISO } from "date-fns";
import WeatherIcon from '@/components/WeatherIcon';
import { useWeatherData } from '@/features/hooks/useWeatherData';
import { convertUnixTimeToDate } from "@/utils/convertUnixTime";
import ForecastChart from "@/components/Chart";
import DropDown from "@/components/Dropdown";
import { extractChart } from "@/utils/extractChart";
import { useForecast } from "@/features/hooks/useForecast";


export default function Home() {
  const {place,weatherData,handleOnChange,searchParams,todayDate} = useWeatherData();
  const {firstDataForEachDate} = useForecast();

return (
  <div className="w-screen flex flex-col gap-4 justify-between bg-gray-100 overflow-scroll">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/> 
    <nav className="w-screen flex shadow-sm justify-between sticky top-0 left-0 z-50 bg-white">
        <div className="w-screen flex justify-between items-center max-w-7xl px-3 mx-auto">
          <div className="text-4xl font-extrabold dark:text-white">Weather</div>
          <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
          <section className="flex gap-2 items-center">
            <MdMyLocation
              title="Your Current Location"
              className="text-2xl  text-gray-400 hover:opacity-80 cursor-pointer"
            />
            <MdOutlineLocationOn className="text-3xl" />
            <p className="text-slate-900/80 text-sm"> {place} </p>
            <div className="relative md:flex">
              {/* SearchBox */}
              <DropDown onChange={handleOnChange} value={searchParams.get('query')?.toString()}
              />
            </div>
          </section>
        </div>
      </nav>
      <div className="w-min flex flex-row px-20 space-x-8 shadow-sm justify-between items-center">
      <div className="w-1/2 flex flex-col">
      <h2 className="text-2xl text-center font-semibold">{todayDate}{" "} {" "}{weatherData?.dt ? convertUnixTimeToDate(weatherData.dt).toLocaleTimeString():null}</h2>
      <p className="text-2xl text-center font-semibold">Current Weather</p>
        <div className="w-full bg-white border flex flex-row rounded-xl px-20 space-x-12 shadow-sm justify-between items-center mt-4">
              <div className='items-center justify-between'>
              {weatherData?.weather.map(condition =>
                <WeatherIcon iconName={condition.icon} />)
              }
              </div>
              <div className="flex flex-col items-center justify-between">
                <strong>{Math.floor(weatherData?.main.temp ?? 0)}°</strong>
                <div>Feels like {Math.floor(weatherData?.main.feels_like ?? 0)}°</div>
                <div className='flex flex-col'>
                <p>{Math.floor(weatherData?.main.temp_min ?? 0)}°↓</p>
                <p>{Math.floor(weatherData?.main.temp_max ?? 0)}°↑</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center justify-between text-s font-semibold text-black/80">
                <p className="whitespace-nowrap">Humidity</p>
                <div className="text-3xl"><WiHumidity size={42} color="skyblue" /></div>
                <p>{weatherData?.main.humidity}%</p>
              </div>
              <div className="flex flex-col gap-2 items-center justify-between text-s font-semibold text-black/80">
                <p className="whitespace-nowrap">Wind Speed</p>
                <div className="text-3xl"><WiStrongWind size={42} color="grey" /></div>
                <p>{weatherData?.wind.speed} m/s</p>
              </div>
        </div>
        <p className="text-2xl text-center font-semibold mt-16">Temperature Chart (5 days)</p>
        <div className="w-full bg-white border flex flex-row rounded-xl px-20 space-x-8 shadow-sm items-center justify-between mt-4">
        <ForecastChart data={extractChart()}/>
        </div>
      </div>
      {/* 5 day forecast data  */}
      <div className="w-1/2 flex flex-col justify-between items-center mt-12">
      <p className="text-2xl font-semibold">Forecast (5 days)</p>
      <div className=" bg-white border rounded-xl flex flex-col px-5 space-x-8 shadow-sm justify-between items-center mt-8 ">
              
              {firstDataForEachDate.map((d, i) => (
                <ForecastWeatherDetail
                  key={i}
                  description={d?.weather[0].description ?? ""}
                  weatherIcon={d?.weather[0].icon ?? "01d"}
                  date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
                  feels_like={Math.floor(d?.main.feels_like ?? 0)}
                  temp={Math.floor(d?.main.temp ?? 0)}
                  humidity={`${d?.main.humidity}% `}
                  windSpeed={`${d?.wind.speed ?? 1.64} m/s `}
                />
              ))}
      </div>
      </div>
      </div>
  </div>
  );
}
