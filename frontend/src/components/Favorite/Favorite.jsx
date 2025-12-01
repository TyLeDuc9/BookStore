import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  addToFavorite,
  removeFromFavorite,
  checkIsFavorite,
} from "../../redux/Favorite/apiFavorite";

export const Favorite = ({ userId, bookDetailId }) => {
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!userId || !bookDetailId) return;

    const fetchFavoriteStatus = async () => {
      try {
        const isFav = await checkIsFavorite(userId, bookDetailId);
        setLiked(isFav);
      } catch (err) {
        console.error("❌ Lỗi kiểm tra yêu thích:", err);
      }
    };

    fetchFavoriteStatus();
  }, [userId, bookDetailId]);

  const handleClick = async () => {
    if (!userId) {
      alert("Vui lòng đăng nhập để thêm yêu thích");
      return;
    }

    try {
      if (liked) {
        await dispatch(removeFromFavorite(userId, bookDetailId));
        setLiked(false);
      } else {
        await dispatch(addToFavorite(userId, { _id: bookDetailId }));
        setLiked(true);
      }
    } catch (err) {
      console.error("❌ Lỗi cập nhật yêu thích:", err);
    }
  };

  return (
    <div className="cursor-pointer flex items-center" onClick={handleClick}>
      <FaHeart
        className={`${
          liked ? "text-red-500" : "text-gray-300"
        } lg:text-lg text-base transition-colors duration-200`}
      />
    </div>
  );
};
