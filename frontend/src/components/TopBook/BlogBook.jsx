// import React, { useEffect } from 'react';
// import { useAllBlog } from "../../hooks/useAllBlog";
// import Slider from 'react-slick';
// import { FaCalendarAlt } from "react-icons/fa";
// import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
// import { useNavigate } from 'react-router-dom';
// import { useLoading } from '../../context/LoadingContext';
// import { ComponentLoading } from "../../components/Loading/ComponentLoading";
// // 👉 Custom arrows
// const NextArrow = ({ onClick }) => (
//   <div
//     className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 
//     bg-gray-100/80 p-2 rounded-full hover:bg-gray-200 transition"
//     onClick={onClick}
//   >
//     <MdArrowForwardIos className="text-gray-600 lg:text-xl text-lg" />
//   </div>
// );

// const PrevArrow = ({ onClick }) => (
//   <div
//     className="absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 
//     bg-gray-100/80 p-2 rounded-full hover:bg-gray-200 transition"
//     onClick={onClick}
//   >
//     <MdArrowBackIos className="text-gray-600 lg:text-xl text-lg" />
//   </div>
// );

// // 👉 Slider settings
// const settings = {
//   dots: false,
//   infinite: false,
//   speed: 500,
//   slidesToShow: 3,
//   slidesToScroll: 1,
//   autoplay: false,
//   autoplaySpeed: 3000,
//   arrows: true,
//   nextArrow: <NextArrow />,
//   prevArrow: <PrevArrow />,
//   responsive: [
//     {
//       breakpoint: 1024,
//       settings: {
//         slidesToShow: 3,
//         slidesToScroll: 1,
//         arrows: true,
//       },
//     },
//     {
//       breakpoint: 767,
//       settings: {
//         slidesToShow: 2,
//         slidesToScroll: 1,
//         arrows: false, // Ẩn arrow trên mobile (nếu muốn)
//       },
//     },
//   ],
// };



// export const BlogBook = () => {
//   const { blogs, loading, error } = useAllBlog();
//   const navigate = useNavigate()

//   const handleBlog = (id) => {
//     navigate(`/blog/${id}`)
//   }

//   const { setComponentsLoading } = useLoading();

//   useEffect(() => {
//     setComponentsLoading(loading);
//   }, [loading]);
//   if (loading) return <ComponentLoading />;
//   if (error)
//     return <p className="text-center text-red-500 mt-10">Error: {error.message}</p>;

//   return (
//     <div className="relative w-[90%] mx-auto lg:my-12 sm:my-12 my-6">
//       <Slider {...settings}>
//         {blogs.map((item) => (
//           <div key={item._id} className="px-4">
//             <div className="bg-gray-100 rounded-lg overflow-hidden flex flex-col lg:h-80 sm:h-80 h-48">
//               {/* Image */}
//               <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden">
//                 <img
//                   onClick={() => handleBlog(item._id)}
//                   src={item.images[0]}
//                   alt={item.title}
//                   className="lg:w-full sm:w-full sm:h-48 lg:h-48 object-cover cursor-pointer"
//                 />

//               </div>

//               {/* Content */}
//               <div className="p-2 flex-1 flex flex-col justify-between">
//                 <div>
//                   <p className="text-xs text-gray-500 flex items-center italic">
//                     <FaCalendarAlt className="text-gray-400" />
//                     {new Date(item.createdAt).toLocaleDateString("vi-VN")}
//                   </p>

//                   <h3
//                     onClick={() => handleBlog(item._id)}
//                     className="lg:text-base text-sm line line-clamp-2 font-medium py-2 hover:text-[#4d8898] lg:line-clamp-3 cursor-pointer">
//                     {item.title}
//                   </h3>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };
import React, { useState, useEffect, useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAllBlog } from "../../hooks/useAllBlog";
import { useLoading } from "../../context/LoadingContext";
import { ComponentLoading } from "../../components/Loading/ComponentLoading";

export const BlogBook = () => {
  const { blogs, loading, error } = useAllBlog();
  const navigate = useNavigate();
  const { setComponentsLoading } = useLoading();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const containerRef = useRef(null);

  useEffect(() => {
    setComponentsLoading(loading);
  }, [loading]);

  useEffect(() => {
    // function tính số slide hiển thị
    const updateSlides = () => {
      const width = window.innerWidth;
      if (width < 768) setSlidesToShow(2); // mobile
      else setSlidesToShow(3); // tablet + desktop
    };

    updateSlides();
    window.addEventListener("resize", updateSlides);

    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  if (loading) return <ComponentLoading />;
  if (error)
    return <p className="text-center text-red-500 mt-10">Error: {error.message}</p>;

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, blogs.length - slidesToShow)
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleBlog = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
    <div className="relative w-[90%] mx-auto lg:my-12 sm:my-12 my-6">
      {/* Arrows */}
      {currentIndex > 0 && (
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-100/80 p-2 rounded-full cursor-pointer hover:bg-gray-200 transition"
          onClick={prevSlide}
        >
          <MdArrowBackIos className="text-gray-600 lg:text-xl text-lg" />
        </div>
      )}
      {currentIndex < blogs.length - slidesToShow && (
        <div
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-100/80 p-2 rounded-full cursor-pointer hover:bg-gray-200 transition"
          onClick={nextSlide}
        >
          <MdArrowForwardIos className="text-gray-600 lg:text-xl text-lg" />
        </div>
      )}

      {/* Slider */}
      <div className="overflow-hidden">
        <div
          ref={containerRef}
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${(100 / slidesToShow) * currentIndex}%)`,
            width: `${(100 / slidesToShow) * blogs.length}%`,
          }}
        >
          {blogs.map((item) => (
            <div
              key={item._id}
              className={`px-2`}
              style={{ width: `${100 / blogs.length}%` }}
            >
              <div className="bg-gray-100 rounded-lg overflow-hidden flex flex-col lg:h-80 sm:h-80 h-48">
                <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden">
                  <img
                    onClick={() => handleBlog(item._id)}
                    src={item.images[0]}
                    alt={item.title}
                    className="lg:w-full sm:w-full sm:h-48 lg:h-48 object-cover cursor-pointer"
                  />
                </div>

                <div className="p-2 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-500 flex items-center italic">
                      <FaCalendarAlt className="text-gray-400" />
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </p>

                    <h3
                      onClick={() => handleBlog(item._id)}
                      className="lg:text-base text-sm line line-clamp-2 font-medium py-2 hover:text-[#4d8898] lg:line-clamp-3 cursor-pointer"
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
