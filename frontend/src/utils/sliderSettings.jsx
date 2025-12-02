import React from 'react';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';

export const NextArrow = ({ onClick }) => (
  <div
    className="absolute lg:right-2 -right-2 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 bg-gray-100/70 p-2 
    hover:opacity-75 rounded-full"
    onClick={onClick}
  >
    <MdArrowForwardIos className="text-gray-400 lg:text-xl text-lg" />
  </div>
);

export const PrevArrow = ({ onClick }) => (
  <div
    className="absolute lg:left-2 -left-1 left top-1/2 transform -translate-y-1/2 cursor-pointer z-10 bg-gray-100/70 p-2 hover:opacity-75 
    rounded-full"
    onClick={onClick}
  >
    <MdArrowBackIos className="text-gray-400 lg:text-xl text-lg" />
  </div>
);

export const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 1000,
  slidesToShow: 5,     // Laptop / Desktop
  slidesToScroll: 1,
  autoplay: false,
  arrows: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,

  responsive: [
    {
      breakpoint: 1024, // iPad / Tablet
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 767, // Mobile
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
};
