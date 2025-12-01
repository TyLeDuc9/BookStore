import React, { useState } from 'react';
import Slider from 'react-slick';
import { useBanners } from '../../hooks/useBanners';
import { useNavigate } from 'react-router-dom';

export const Banner = () => {
  const { banners, loading, err } = useBanners();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);

  if (loading) return <p>Đang tải...</p>;
  if (err) return <p>Lỗi: {err.message}</p>;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    beforeChange: () => setIsDragging(true),
    afterChange: () => setTimeout(() => setIsDragging(false), 0),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleClick = (banner) => {
    if (isDragging) return;
    if (banner.bookId) {
      navigate(`/san-pham/${banner.bookId._id}/${banner.bookId.slug}`);
    } else if (banner.categoryId) {
      navigate(`/danh-muc/${banner.categoryId._id}/${banner.categoryId.slug}`);
    }

  };

  return (
    <div className="w-full mx-auto">
      <Slider {...settings}>
        {banners.slice(0, 4).map((banner) => (
          <div
            key={banner._id}
            className="lg:w-full lg:h-[80vh] overflow-hidden cursor-pointer"
            onClick={() => handleClick(banner)}
          >
            <img
              src={banner.imageUrl}
              alt="Banner"
              className="w-full h-full object-cover focus:outline-none"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};
