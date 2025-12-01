import axios from "axios";
// const API_CATEGORY = "http://localhost:8000/category";
const API_CATEGORY = "https://bookstore-backend-vovp.onrender.com/category";
import { getAuthHeader } from "../utils/authHeader";

export const getCategoryById = async (id) => {
  try {
    const res = await axios.get(`${API_CATEGORY}/${id}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Lỗi lấy danh mục!");
  }
};
export const updateCategory = async (id, data) => {
  try {
    const res = await axios.put(`${API_CATEGORY}/${id}`, data, {
      headers: getAuthHeader()
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Lỗi khi cập nhật danh mục");
  }
}
export const deleteCategory = async (id) => {
  try {
    const res = await axios.delete(`${API_CATEGORY}/${id}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Xóa danh mục thất bại");
  }
};

export const createCategory = async (name) => {
  try {
    const res = await axios.post(
      API_CATEGORY,
      { name },
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message)
  }
};


export const getAllCategory = async () => {
  try {
    const res = await axios.get(`${API_CATEGORY}/all`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
