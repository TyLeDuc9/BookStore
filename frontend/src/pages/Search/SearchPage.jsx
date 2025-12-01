import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSearchBook } from "../../hooks/useSearchBook";
import { Title } from "../../components/Title/Title";
import { SortBook } from "../../components/Sort/SortBook";
import { BookCard } from "../../components/BookCard/BookCard";
import { Pagination } from "antd";

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const [sort, setSort] = useState("newest");


  const { books, pagination, loading, error } = useSearchBook(
    query,
    currentPage,
    20,
    sort
  );

  if (!query)
    return <p className="p-4 text-red-500">Vui lòng nhập từ khóa để tìm kiếm.</p>;
  if (loading) return <p>Đang tải sách...</p>;
  if (error) return <p>Lỗi: {error}</p>;
  return (
    <div className="bg-[#ffffff] w-[85%] mx-auto my-12 gap-4">
      <Link className="hover:text-[#364e57]" to="/">Trang chủ</Link>/Tìm kiếm
      <Title
        className="text-xl font-medium mb-4 text-center uppercase my-8"
        title={`Kết quả tìm kiếm cho: ${query}`}
      />

      <div className="flex justify-between mb-6">
        <p className="text-[#2d525c] ml-4 font-medium">Sản phẩm phù hợp</p>
        <SortBook sort={sort} setSort={setSort} />
      </div>



      <div className="grid grid-cols-5 gap-6">
        {books.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>

      {pagination?.total > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={currentPage}
            pageSize={pagination.limit || 20}
            total={pagination.total}
            onChange={(page) => {
              setSearchParams({ q: query, page });
            }}
          />
        </div>
      )}
    </div>
  );
};
