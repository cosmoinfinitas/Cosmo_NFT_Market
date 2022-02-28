import React from "react";
import Link from "next/link";
import logo from "../public/icon.png";
import Image from "next/image";

function Navbar() {
  return (
    <div className=" max-w-10xl mx-auto px-2 sm:px-6 lg:px-8 bg-gray-800">
      <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
        <div className="hidden sm:block sm:ml-6 h-20 w-20 animate-pulse">
          <Image src={logo} />
        </div>

        <div className=" flex items-center justify-center pl-5">
          <input
            type="text"
            placeholder="Collection,item or user"
            className="px-4 py-2 border-2 border-gray-200 rounded w-96"
          />
        </div>
        <div className=" pt-6 pl-4">
          <svg
            width="32px"
            height="32px"
            viewBox="0 0 140 64"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            color="white"
          >
            <path
              d="M30.262 57.02L7.195 40.723c-5.84-3.976-7.56-12.06-3.842-18.063 3.715-6 11.467-7.65 17.306-3.68l4.52 3.76 2.6-5.274c3.717-6.002 11.47-7.65 17.305-3.68 5.84 3.97 7.56 12.054 3.842 18.062L34.49 56.118c-.897 1.512-2.793 1.915-4.228.9z"
              fillOpacity=".5"
            >
              <animate
                attributeName="fill-opacity"
                begin="0s"
                dur="1.4s"
                values="0.5;1;0.5"
                calcMode="linear"
                repeatCount="indefinite"
              ></animate>
            </path>
            <path
              d="M105.512 56.12l-14.44-24.272c-3.716-6.008-1.996-14.093 3.843-18.062 5.835-3.97 13.588-2.322 17.306 3.68l2.6 5.274 4.52-3.76c5.84-3.97 13.592-2.32 17.307 3.68 3.718 6.003 1.998 14.088-3.842 18.064L109.74 57.02c-1.434 1.014-3.33.61-4.228-.9z"
              fillOpacity=".5"
            >
              <animate
                attributeName="fill-opacity"
                begin="0.7s"
                dur="1.4s"
                values="0.5;1;0.5"
                calcMode="linear"
                repeatCount="indefinite"
              ></animate>
            </path>
            <path d="M67.408 57.834l-23.01-24.98c-5.864-6.15-5.864-16.108 0-22.248 5.86-6.14 15.37-6.14 21.234 0L70 16.168l4.368-5.562c5.863-6.14 15.375-6.14 21.235 0 5.863 6.14 5.863 16.098 0 22.247l-23.007 24.98c-1.43 1.556-3.757 1.556-5.188 0z"></path>
          </svg>
        </div>

        <div className="flex items-center float-right pl-28 ml-40">
          <div className="ml-40">
            <Link href="/">
              <a className="mr-6">
                <button className=" bg-gray-800 p-1 rounded-md text-gray-400 hover:text-white focus:outline-none  hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  Home
                </button>
              </a>
            </Link>
            <Link href="/createitem">
              <a className="mr-6 ">
                <button className="bg-gray-800 p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  Create Item
                </button>
              </a>
            </Link>
            <Link href="/my-assets">
              <a className="mr-6 ">
                <button className="bg-gray-800 p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  MY NFTs
                </button>
              </a>
            </Link>
            <Link href="/creator-dashboard">
              <a className="mr-6 ">
                <button className="bg-gray-800 p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  Creator Dashboard
                </button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
