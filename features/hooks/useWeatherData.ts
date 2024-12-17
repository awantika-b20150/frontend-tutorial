'use client';
import { useEffect, useState } from 'react';
import { WeatherDetail } from '@/types/CurrentWeatherType';
import { WeatherData } from '@/types/ForecastWeatherType';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import axios from "axios";

export const useWeatherData = () => {
    const [place,setPlace] = useState<string>("Japan");
    const [latitude,setLatitude] = useState<number>(0);
    const [longitude,setLongitude] = useState<number>(0);
    const [weatherData,setWeatherData] = useState<WeatherDetail>();
    const [forecast,setForecast] = useState<WeatherData>();
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const todayDate= `${year}/${month}/${day}`;

    //page routing
      const searchParams = useSearchParams();
      const params = new URLSearchParams(searchParams); //updating url
      const pathname = usePathname();
      const { replace } = useRouter();
      const handleOnChange = async (value:string) => {
        setPlace(value);
      };

    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const DIRECT_URL=`${BASE_URL}/geo/1.0/direct?`;
    const WEATHER_URL=`${BASE_URL}/data/2.5/weather?`;
    const FORECAST_URL=`${BASE_URL}/data/2.5/forecast?`;
     
    useEffect(() => {
          axios
          .get(DIRECT_URL,{
            params: {
              q: place,
              limit:5,
              appid:API_KEY
            }
          }) //getting coordinates based on place selected by user
          .then((response) => {
              const data = response.data;
              setLatitude(data[0].lat);
              setLongitude(data[0].lon);
          });
            if (place) {
              params.set('query', place);
            } else {
              params.delete('query');
            }
            replace(`${pathname}?${params.toString()}`);
        
    }, [place]); 
    
    useEffect(() => {
      axios
        .get(WEATHER_URL,{
          params: {
            lat: latitude,
            lon:longitude,
            appid:API_KEY,
            units:'metric'
          }
        }) //getting current data
        .then((response) => {
            const data = response.data;
            setWeatherData(data);
        });
    
    }, [latitude,longitude]);

    useEffect(() => {
      axios
      .get(FORECAST_URL,{
        params: {
          lat: latitude,
          lon:longitude,
          appid:API_KEY,
          units:'metric'
        }
      }) //getting next 5days data
      .then((response) => {
          const data = response.data;
          setForecast(data);
      });
    
    }, [weatherData]);



    return {place,setPlace,latitude,setLatitude,longitude,setLongitude,weatherData,setWeatherData,forecast,setForecast,handleOnChange,searchParams,todayDate};
}