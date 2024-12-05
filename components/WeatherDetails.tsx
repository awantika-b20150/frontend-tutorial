import React from "react";
import { FiDroplet } from "react-icons/fi";
import { MdAir } from "react-icons/md";

export interface WeatherDetailProps {
  humidity: string;
  windSpeed: string;
}

export default function WeatherDetails(props: WeatherDetailProps) {
  const {
    humidity = "61%",
    windSpeed = "7 km/h",
  } = props;

  return (
    <>
      <SingleWeatherDetail
        icon={<FiDroplet />}
        information="Humidity"
        value={humidity}
      />
      <SingleWeatherDetail
        icon={<MdAir />}
        information="Wind speed"
        value={windSpeed}
      />
    </>
  );
}

export interface SingleWeatherDetailProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
  return (
    <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80">
      <p className="whitespace-nowrap">{props.information}</p>
      <div className="text-3xl">{props.icon}</div>
      <p>{props.value}</p>
    </div>
  );
}
