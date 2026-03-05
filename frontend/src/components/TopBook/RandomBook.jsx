import React, { useEffect } from 'react'
import { useRandomBook } from '../../hooks/useRandomBook';
import { ItemSlider } from "../Slider/ItemSlider";
import { BookCard } from '../BookCard/BookCard';
import { useLoading } from '../../context/LoadingContext';
import { ComponentLoading } from "../../components/Loading/ComponentLoading";
export const RandomBook = () => {
    const { randomBook, loading, err } = useRandomBook()
    const { setComponentsLoading } = useLoading();

    useEffect(() => {
        setComponentsLoading(loading);
    }, [loading]);

    if (loading) return <ComponentLoading />;
    if (loading) return <p>Đang tải</p>;
    if (err) return <p>Có lỗi xảy ra khi tải</p>;
    return (
        <div className="w-[89%] mx-auto lg:my-8 my-4">
            <ItemSlider
                data={randomBook}
                getKey={(item) => item._id}
                renderItem={(item) => <BookCard book={item} />}
            />

        </div>
    )
}
