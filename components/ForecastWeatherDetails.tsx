import React from "react";
import WeatherIcon from "./WeatherIcon";
import { WiHumidity,WiStrongWind } from "react-icons/wi";


export interface SingleWeatherDetailProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
  return (
    <div className="flex flex-col gap-2 justify-center items-center text-xs font-semibold text-black/80">
      <p className="whitespace-nowrap">{props.information}</p>
      <div className="text-3xl">{props.icon}</div>
      <p>{props.value}</p>
    </div>
  );
}


export interface ForecastWeatherDetailProps {
  weatherIcon: string;
  date: string;
  temp: number;
  feels_like: number;
  description: string;
  humidity: string;
  windSpeed: string;
}

export default function ForecastWeatherDetail(
  props: ForecastWeatherDetailProps
) {
  const {
    weatherIcon = "02d",
    date = "19.09",
    temp,
    feels_like,
    description,
    humidity,
    windSpeed
  } = props;
  return (
    <div className="gap-8 flex flex-row h-full justify-center items-center">
      {/* left */}
        <div className=" flex flex-col gap-auto justify-center items-center">
          <WeatherIcon iconName={weatherIcon} />
          <p>{date}</p>
        </div>
        <div className="flex flex-col px-4 justify-center items-center">
          <span className="text-5xl">{temp ?? 0}°</span>
          <p className="text-xs space-x-1 whitespace-nowrap">
            <span> Feels like</span>
            <span>{feels_like ?? 0}°</span>
          </p>
          <p className="capitalize"> {description}</p>
        </div>
      <div className="flex flex-row justify-center gap-4 px-4  w-full pr-4 items-center">
        <SingleWeatherDetail
          icon={<WiHumidity color="skyblue"/>}
          information="Humidity"
          value={humidity}
        />
        <SingleWeatherDetail
          icon={<WiStrongWind color="grey"/>}
          information="Wind speed"
          value={windSpeed}
        />
      </div>
    </div>
  );
}
