'use client';
import localFont from "next/font/local";
import { useEffect, useState } from 'react'
import axios from "axios";
import Prefectures from "@/utils/Pref";
import { Select } from 'antd';
import { MdOutlineLocationOn, MdWbSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import { WiHumidity,WiStrongWind } from "react-icons/wi";
import  ForecastWeatherDetail  from "@/components/ForecastWeatherDetails";
import { format, parseISO } from "date-fns";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,Legend } from 'recharts';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

interface WeatherDetail {
  dt: number;
  dt_txt:string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}
interface Chart {
  dates:string,
  temp:number
}

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
export function getIconUrl(code: string): string {
  return `http://openweathermap.org/img/wn/${code}.png`;
}

export default function Home() {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [weatherData,setWeatherData] = useState<WeatherDetail>();
  const [latitude,setLatitude] = useState(0);
  const [longitude,setLongitude] = useState(0);
  const [place,setPlace] = useState("Japan");
  const [forecast,setForecast] = useState<WeatherData>();

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  let todayDate= `${year}/${month}/${day}`;
  
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleOnChange = async (value:string) => {
    setPlace(value);
  };

  useEffect(() => {
    axios
        .get(`http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=5&appid=${API_KEY}`)
        .then((response) => {
            const data = response.data;
            setLatitude(data[0].lat);
            setLongitude(data[0].lon)
        });
    axios
        .get(`${BASE_URL}weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
        .then((response) => {
            const data = response.data;
            setWeatherData(data);
        });
    axios
      .get(`${BASE_URL}forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
      .then((response) => {
          const data = response.data;
          setForecast(data);
      });
      const params = new URLSearchParams(searchParams);
      if (place) {
        params.set('query', place);
      } else {
        params.delete('query');
      }
      replace(`${pathname}?${params.toString()}`);
    
}, [place,latitude,longitude]); 

function convertUnixTimeToDate(unixUtc: number): Date {
  return new Date(unixUtc * 1000);
}

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


const chart_temp = new Array<Chart>;
firstDataForEachDate.map((d) => 
  chart_temp.push({
    temp:(Math.floor(d?.main.temp ?? 0)),
    dates: (d ? format(parseISO(d.dt_txt), "dd.MM") : "")
  }
));



return (
  <div className="flex flex-col gap-4 bg-gray-100 min-h-screen md:flex">
    <nav className="flex shadow-sm  sticky top-0 left-0 z-50 bg-white md:flex">
        <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
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

              <Select
              showSearch
              placeholder="Select prefecture"
              optionFilterProp="label"
              onChange={handleOnChange}
              options={Prefectures}
              value={searchParams.get('query')?.toString()}
              />
            </div>
          </section>
        </div>
      </nav>
      <h2 className="text-4xl font-extrabold dark:text-white px-20 text-center">{todayDate}{" "} {" "}{weatherData?.dt ? convertUnixTimeToDate(weatherData.dt).toLocaleTimeString():null}</h2>
      <div className="w-full flex flex-row px-20 space-x-8 shadow-sm items-center md:flex">
      <div className="w-1/2">
      <p className="text-2xl text-center font-semibold">Current Weather</p>
        <div className="w-full bg-white border flex flex-row rounded-xl px-20 space-x-12 shadow-sm justify-center items-center mt-4 md:flex">
              <div>
              {weatherData?.weather.map(condition =>
                <div key={condition.id}>
                  <img src={getIconUrl(condition.icon)} alt={condition.main}/> {condition.main}
                </div>)
              }
              </div>
              <div className="flex flex-col items-center justify-centre">
                <strong>{Math.floor(weatherData?.main.temp ?? 0)}°</strong>
                <div>Feels like {Math.floor(weatherData?.main.feels_like ?? 0)}°</div>
                <div>({Math.floor(weatherData?.main.temp_min ?? 0)}°↓{" "} {" "} {Math.floor(weatherData?.main.temp_max ?? 0)}°↑)</div>
              </div>
              <div className="flex flex-col gap-2 items-center text-s font-semibold text-black/80">
                <p className="whitespace-nowrap">Humidity</p>
                <div className="text-3xl"><WiHumidity size={42} color="skyblue" /></div>
                <p>{weatherData?.main.humidity}%</p>
              </div>
              <div className="flex flex-col gap-2 items-center text-s font-semibold text-black/80">
                <p className="whitespace-nowrap">Wind Speed</p>
                <div className="text-3xl"><WiStrongWind size={42} color="grey" /></div>
                <p>{weatherData?.wind.speed}{" "}m/s</p>
              </div>
        </div>
        <p className="text-2xl text-center font-semibold mt-16">Temperature Chart (5 days)</p>
        <div className="w-full bg-white border flex flex-row rounded-xl px-20 space-x-8 shadow-sm items-center mt-4 md:flex">
        <LineChart width={600} height={300} data={chart_temp} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type="monotone" dataKey="temp" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="dates" />
            <YAxis />
            <Tooltip />
            <Legend />
          </LineChart>
        </div>
      </div>
      {/* 5 day forecast data  */}
      <div className="w-1/2 bg-white border rounded-xl flex flex-col px-20 space-x-8 shadow-sm items-center md:flex">
              <p className="text-2xl font-semibold">Forecast (5 days)</p>
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
  );
}
