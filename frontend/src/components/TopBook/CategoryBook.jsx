import React, { useEffect } from 'react';
import { useCategoryBook } from '../../hooks/useCategoryBook';
import { BookCard } from '../BookCard/BookCard';
import { ViewAll } from '../ViewAll/ViewAll';
import { ItemSlider } from "../Slider/ItemSlider";
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
export const CategoryBook = ({ id, slug }) => {
  const { categoryBook, loading, err } = useCategoryBook(id, slug);
  const { setComponentsLoading } = useLoading();

  useEffect(() => {
    setComponentsLoading(loading);
  }, [loading]);
  if (loading) return <ComponentLoading />;
  if (err) return <p>Có lỗi xảy ra khi tải</p>;

  return (
    <div className="w-[89%] mx-auto lg:my-8 my-4">
      <ViewAll id={id} slug={slug} />

      <ItemSlider
        data={categoryBook}
        getKey={(item) => item._id}
        renderItem={(item) => <BookCard book={item} />}
      />


    </div>
  );
};
