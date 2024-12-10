/** @format */
"use client";

import React from "react";
import { Select } from 'antd';
import { MdOutlineLocationOn, MdWbSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import Prefectures from "@/utils/Pref";
import { useState } from "react";
import axios from "axios";
import { atom,useAtom } from "jotai";


const placeAtom = atom("Japan");
const loadingCityAtom = atom(false);
type Props = { location?: string };
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);

  async function handleInputChange(value: string) {
    setCity(value);
    try {
        const response = await axios.get(
          `${BASE_URL}find?q=${value}&appid=${API_KEY}`
        );
        setError("");
      }
      
    catch(error)
    {
      setPlace("Japan");
    }
    
  }

  function handleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (postiion) => {
        const { latitude, longitude } = postiion.coords;
        try {
          setLoadingCity(true);
          const response = await axios.get(
            `${process.env.BASE_URL}weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          setTimeout(() => {
            setLoadingCity(false);
            setPlace(response.data.name);
          }, 500);
        } catch (error) {
          setLoadingCity(false);
        }
      });
    }
  }
  return (
    <>
      <nav className="shadow-sm  sticky top-0 left-0 z-50 bg-white">
        <div className="h-[80px]     w-full    flex   justify-between items-center  max-w-7xl px-3 mx-auto">
          <p className="flex items-center justify-center gap-2  ">
            <h2 className="text-gray-500 text-3xl">Weather</h2>
            <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
          </p>
          <section className="flex gap-2 items-center">
            <MdMyLocation
              title="Your Current Location"
              onClick={handleCurrentLocation}
              className="text-2xl  text-gray-400 hover:opacity-80 cursor-pointer"
            />
            <MdOutlineLocationOn className="text-3xl" />
            <p className="text-slate-900/80 text-sm"> {location} </p>
            <div className="relative hidden md:flex">
              {/* SearchBox */}
              <Select
                showSearch
                placeholder="Select prefecture"
                optionFilterProp="label"
                onSearch={handleInputChange}
                options={Prefectures}
              />
            </div>
          </section>
        </div>
      </nav>
      <section className="flex   max-w-7xl px-3 md:hidden ">
        <div className="relative ">
          {/* SearchBox */}

          <Select
            showSearch
            placeholder="Select prefecture"
            optionFilterProp="label"
            onSearch={handleInputChange}
            options={Prefectures}
          />
        </div>
      </section>
    </>
  );
}

