// import React, {useEffect} from 'react';
// import { useCategoryBook } from '../../hooks/useCategoryBook';
// import { sliderSettings } from '../../utils/sliderSettings';
// import Slider from 'react-slick';
// import { BookCard } from '../BookCard/BookCard';
// import { ViewAll } from '../ViewAll/ViewAll';
// import { useLoading } from '../../context/LoadingContext';
// import { ComponentLoading } from "../../components/Loading/ComponentLoading";
// export const CategoryBook = ({ id, slug }) => {
//   const { categoryBook, loading, err } = useCategoryBook(id, slug);
//   const { setComponentsLoading } = useLoading();

//   useEffect(() => {
//     setComponentsLoading(loading);
//   }, [loading]);
//   if (loading) return <ComponentLoading />;
//   if (err) return <p>Có lỗi xảy ra khi tải</p>;

//   return (
//     <div className="w-[89%] mx-auto lg:my-8 my-4">
//       <ViewAll id={id} slug={slug} />

//       <Slider {...sliderSettings}>
//         {categoryBook.map((item) => (
//           <div key={item.id}>
//             <BookCard book={item} />
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };
import React, { useEffect, useMemo } from 'react';
import { useCategoryBook } from '../../hooks/useCategoryBook';
import Slider from 'react-slick';
import { BookCard } from '../BookCard/BookCard';
import { ViewAll } from '../ViewAll/ViewAll';
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';

// ---- Arrow Components ----
const NextArrow = ({ onClick }) => (
  <div
    className="absolute lg:right-2 -right-2 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 bg-gray-100/70 p-2 hover:opacity-75 rounded-full"
    onClick={onClick}
  >
    <MdArrowForwardIos className="text-gray-400 lg:text-xl text-lg" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute lg:left-2 -left-1 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 bg-gray-100/70 p-2 hover:opacity-75 rounded-full"
    onClick={onClick}
  >
    <MdArrowBackIos className="text-gray-400 lg:text-xl text-lg" />
  </div>
);

export const CategoryBook = ({ id, slug }) => {
  const { categoryBook, loading, err } = useCategoryBook(id, slug);
  const { setComponentsLoading } = useLoading();

  useEffect(() => {
    setComponentsLoading(loading);
  }, [loading]);

  // ---- Slider config đặt trực tiếp ----
  const sliderSettings = useMemo(() => ({
    dots: false,
    infinite: false,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    mobileFirst: true,

    // Breakpoints phải theo thứ tự lớn → nhỏ
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  }), []);

  if (loading) return <ComponentLoading />;
  if (err) return <p>Có lỗi xảy ra khi tải</p>;

  return (
    <div className="w-[89%] mx-auto lg:my-8 my-4">
      <ViewAll id={id} slug={slug} />

      <Slider {...sliderSettings}>
        {categoryBook.map((item) => (
          <div key={item.id}>
            <BookCard book={item} />
          </div>
        ))}
      </Slider>
    </div>
  );
};
