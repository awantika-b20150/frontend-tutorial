import localFont from "next/font/local";
import { useEffect, useState } from 'react'
import axios from "axios";
import Prefectures from "@/utils/Pref";
import { Select } from 'antd';
import { MdOutlineLocationOn, MdWbSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import { WiHumidity,WiStrongWind } from "react-icons/wi";

interface WeatherDetail {
  dt: number;
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
          console.log(data);
          setForecast(data);
      });
    
}, [place,latitude,longitude]); 

function convertUnixTimeToDate(unixUtc: number): Date {
  return new Date(unixUtc * 1000);
}
const firstData = forecast?.list[0];
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
    const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
    const entryTime = new Date(entry.dt * 1000).getHours();
    return entryDate === date && entryTime >= 6;
  });
});

return (
  <div className="flex flex-col gap-4 bg-gray-100 min-h-screen ">
    <nav className="shadow-sm  sticky top-0 left-0 z-50 bg-white">
        <div className="h-[80px]     w-full    flex   justify-between items-center  max-w-7xl px-3 mx-auto">
          <div className="text-4xl font-extrabold dark:text-white">Weather</div>
          <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
          <section className="flex gap-2 items-center">
            <MdMyLocation
              title="Your Current Location"
              className="text-2xl  text-gray-400 hover:opacity-80 cursor-pointer"
            />
            <MdOutlineLocationOn className="text-3xl" />
            <p className="text-slate-900/80 text-sm"> {place} </p>
            <div className="relative hidden md:flex">
              {/* SearchBox */}

              <Select
              showSearch
              placeholder="Select prefecture"
              optionFilterProp="label"
              onChange={handleOnChange}
              options={Prefectures}
              />
            </div>
          </section>
        </div>
      </nav>
      <section className="flex max-w-7xl px-3 md:hidden ">
        <div className="relative ">
          {/* SearchBox */}

          <Select
          showSearch
          placeholder="Select prefecture"
          optionFilterProp="label"
          onChange={handleOnChange}
          options={Prefectures}
          />
        </div>
      </section>
      <h2 className="text-4xl font-extrabold dark:text-white px-20">{todayDate}{" "} {" "}{weatherData?.dt ? convertUnixTimeToDate(weatherData.dt).toLocaleTimeString():null}</h2>
      <div className="w-1/2 bg-white border rounded-xl flex flex-row px-20 space-x-8 shadow-sm items-center">
            <div>
            {weatherData?.weather.map(condition =>
              <div key={condition.id}>
                <img src={getIconUrl(condition.icon)} alt={condition.main}/> {condition.main}
              </div>)
            }
            </div>
            <div className="flex flex-col items-center justify-centre">
              <strong>{weatherData?.main.temp}°</strong>
              <div>Feels like {weatherData?.main.feels_like}°</div>
              <div>({weatherData?.main.temp_min}°↓{" "} {" "} {weatherData?.main.temp_max}°↑)</div>
            </div>
            <div className="flex flex-col items-center justify-centre">
            <WiHumidity size={42} color="skyblue" />
            <div>Humidity: {weatherData?.main.humidity}%</div>
            </div>
            <div className="flex flex-col items-center justify-centre">
            <WiStrongWind size={42} color="grey"/>
            <div>Wind Speed: {weatherData?.wind.speed}m/s</div>
            </div>
      </div>
  </div>
  );
}
