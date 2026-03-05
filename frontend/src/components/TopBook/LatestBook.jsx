import React, { useEffect } from 'react'
import { ItemSlider } from "../Slider/ItemSlider";
import { useLatestBook } from '../../hooks/useLastestBook';

import { BookCard } from '../BookCard/BookCard';
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
export const LatestBook = () => {
    const { latestBook, loading, err } = useLatestBook()
    const { setComponentsLoading } = useLoading();

    useEffect(() => {
        setComponentsLoading(loading);
    }, [loading]);

    if (loading) return <ComponentLoading />;
    if (err) return <p>Có lỗi xảy ra khi tải</p>;

    return (
        <div className="w-[89%] mx-auto lg:my-8 my-4">
            <ItemSlider
                data={latestBook}
                getKey={(item) => item._id}
                renderItem={(item) => <BookCard book={item} />}
            />
          
        </div>
    )
}
