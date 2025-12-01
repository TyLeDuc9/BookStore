import React from 'react';
import { useAllBlog } from "../../hooks/useAllBlog";
import Slider from 'react-slick';
import { FaCalendarAlt } from "react-icons/fa";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

// 👉 Custom arrows
const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 
    bg-gray-100/80 p-2 rounded-full hover:bg-gray-200 transition"
    onClick={onClick}
  >
    <MdArrowForwardIos className="text-gray-600 lg:text-xl text-lg" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 
    bg-gray-100/80 p-2 rounded-full hover:bg-gray-200 transition"
    onClick={onClick}
  >
    <MdArrowBackIos className="text-gray-600 lg:text-xl text-lg" />
  </div>
);

// 👉 Slider settings
const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 3,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 3, slidesToScroll: 2 },
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 2, slidesToScroll: 1 },
    },
  ],
};

// 👉 Main component
export const BlogBook = () => {
  const { blogs, loading, error } = useAllBlog();
  const navigate = useNavigate()

  const handleBlog = (id) => {
    console.log("ID blog được click:", id) // ✅ kiểm tra ID
    navigate(`/blog/${id}`) // hoặc `/blog/${id}/${slug}` nếu route có slug
  }

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-10">Error: {error.message}</p>;

  return (
    <div className="relative w-[90%] mx-auto lg:my-12 sm:my-12 my-6">
      <Slider {...sliderSettings}>
        {blogs.map((item) => (
          <div key={item._id} className="px-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden flex flex-col lg:h-80 sm:h-80 h-48">
              {/* Image */}
              <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden">
                <img
                  onClick={() => handleBlog(item._id)}
                  src={item.images[0]}
                  alt={item.title}
                  className="lg:w-full sm:w-full sm:h-48 lg:h-48 object-cover cursor-pointer"
                />

              </div>

              {/* Content */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 italic">
                    <FaCalendarAlt className="text-gray-400" />
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                  </p>

                  <h3
                    onClick={() => handleBlog(item._id)}
                    className="lg:text-base text-sm line-clamp-2 font-medium py-2 hover:text-[#4d8898] lg:line-clamp-3 cursor-pointer">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
