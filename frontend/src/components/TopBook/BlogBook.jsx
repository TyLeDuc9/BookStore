import React, { useEffect } from 'react';
import { useAllBlog } from "../../hooks/useAllBlog";
import { FaCalendarAlt } from "react-icons/fa";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";



export const BlogBook = () => {
  const { blogs, loading, error } = useAllBlog();
  const navigate = useNavigate()

  const handleBlog = (id) => {
    navigate(`/blog/${id}`)
  }

  const { setComponentsLoading } = useLoading();

  useEffect(() => {
    setComponentsLoading(loading);
  }, [loading]);
  if (loading) return <ComponentLoading />;
  if (error)
    return <p className="text-center text-red-500 mt-10">Error: {error.message}</p>;

  return (
    <div className="relative w-[90%] mx-auto lg:my-12 sm:my-12 my-6">
      <div className='grid lg:grid-cols-4 grid-cols-2 '>
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
              <div className="p-2 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-gray-500 flex items-center italic">
                    <FaCalendarAlt className="text-gray-400" />
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                  </p>

                  <h3
                    onClick={() => handleBlog(item._id)}
                    className="lg:text-base text-sm line line-clamp-2 font-medium py-2 hover:text-[#4d8898] lg:line-clamp-3 cursor-pointer">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
