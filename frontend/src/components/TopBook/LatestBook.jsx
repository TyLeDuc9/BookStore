import React, { useEffect } from 'react'
import { useLatestBook } from '../../hooks/useLastestBook';
import { sliderSettings } from '../../utils/sliderSettings';
import Slider from 'react-slick';
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
        <div className="overflow-x-hidden">
            <div className="lg:w-[89%] lg:mx-auto lg:my-8 my-4 px-4 sm:px-6">
                <Slider {...sliderSettings}>
                    {latestBook.map((item) => (
                        <div key={item.id}>
                            <BookCard book={item} />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>

    )
}
