import axios from "axios";
import { getAuthHeader } from "../utils/authHeader";
import { API } from "../config/api";
const API_DISCOUNT = `${API}/discount`;

// ✅ Lấy tất cả discount
export const getAllDiscount = async () => {
  const res = await axios.get(API_DISCOUNT);
  return res.data;
};

// ✅ Tạo discount
export const createDiscount = async (data) => {
  const res = await axios.post(API_DISCOUNT, data, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// ✅ Xóa discount
export const deleteDiscount = async (id) => {
  const res = await axios.delete(`${API_DISCOUNT}/${id}`, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// ✅ Lấy discount theo ID
export const getDiscountById = async (id) => {
  const res = await axios.get(`${API_DISCOUNT}/${id}`);
  return res.data;
};

// ✅ Cập nhật discount
export const updateDiscount = async (id, data) => {
  const res = await axios.put(`${API_DISCOUNT}/${id}`, data, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
