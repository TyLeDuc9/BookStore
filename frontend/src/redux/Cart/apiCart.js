import axios from "axios";
import {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailed,
  addItemSuccess,
  updateItemSuccess,
  removeItemSuccess,
  clearCartSuccess,
} from "./cartSlice";

const API_CART = "http://localhost:8000/cart";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

// 🛒 Lấy giỏ hàng
export const fetchCart = async (dispatch) => {
  dispatch(fetchCartStart());
  try {
    const res = await axios.get(API_CART, { headers: getAuthHeader() });
    dispatch(fetchCartSuccess(res.data.cart));
  } catch (err) {
    dispatch(fetchCartFailed(err.response?.data?.message || err.message));
  }
};

// 🛒 Thêm sản phẩm
export const addToCart = async (dispatch, { bookdetailId, quantity }) => {
  try {
    const res = await axios.post(
      `${API_CART}/add`,
      { bookdetailId, quantity },
      { headers: getAuthHeader() }
    );
    dispatch(addItemSuccess(res.data.cart));
  } catch (err) {
    dispatch(fetchCartFailed(err.response?.data?.message || err.message));
  }
};

// 🛒 Cập nhật số lượng
export const updateCartItem = async (dispatch, { itemId, quantity }) => {
  try {
    const res = await axios.put(
      `${API_CART}/update`,
      { itemId, quantity },
      { headers: getAuthHeader() }
    );
    dispatch(updateItemSuccess(res.data.cart));
  } catch (err) {
    dispatch(fetchCartFailed(err.response?.data?.message || err.message));
  }
};

// 🛒 Xóa sản phẩm
export const removeCartItem = async (dispatch, { itemId }) => {
  try {
    const res = await axios.delete(`${API_CART}/remove`, {
      data: { itemId },
      headers: getAuthHeader(),
    });
    dispatch(removeItemSuccess(res.data.cart));
  } catch (err) {
    dispatch(fetchCartFailed(err.response?.data?.message || err.message));
  }
};

// 🛒 Xóa toàn bộ giỏ
export const clearCart = async (dispatch) => {
  try {
    await axios.delete(`${API_CART}/clear`, {
      headers: getAuthHeader(),
    });
    dispatch(clearCartSuccess());
  } catch (err) {
    dispatch(fetchCartFailed(err.response?.data?.message || err.message));
  }
};
