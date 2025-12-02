import axios from "axios";
import { getAuthHeader } from "../utils/authHeader";


// const API_ORDER_DETAIL = "http://localhost:8000/order-detail";
const API_ORDER_DETAIL = "https://bookstore-backend-wy3q.onrender.com/order-detail";


export const getOrderDetails = async ({ orderId }) => {
  try {
    const res = await axios.get(`${API_ORDER_DETAIL}/${orderId}`, {
      headers: getAuthHeader(),
    })
    return res.data
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", err.response?.data || err);
    throw err.response?.data || err;
  }
}
const API_ORDER = "https://bookstore-backend-wy3q.onrender.com/order";

export const getRevenue = async ({ type = "day", page = 1, limit = 20, sort = "newest" }) => {
  try {
    const res = await axios.get(`${API_ORDER}/revenue`, {
      params: { type, page, limit, sort },
      headers: getAuthHeader(),
    });

    return res.data;  // gồm data + pagination
  } catch (err) {
    console.error("Error getRevenue:", err.response?.data || err.message);
    throw err;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await axios.put(
      `${API_ORDER}/status/${orderId}`,
      { status },
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (error) {
    console.error("Update status error:", error.response?.data);
    throw error;
  }
};
export const getOrderById = async (orderId) => {
  try {0
    const res = await axios.get(`${API_ORDER}/orders/${orderId}`, {
      headers: getAuthHeader(),
    });

    return res.data;  
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw err;
  }
};

export const getOrdersByStatus = async ({ status = "pending", page = 1, limit = 20, sort = "newest" }) => {
  try {
    const res = await axios.get(API_ORDER, {
      params: { status, page, limit, sort },
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi lấy đơn hàng:", err.response?.data || err.message);
    throw err;
  }
};

export const getOrdersByUser = async ({ userId, page = 1, limit = 20 }) => {
  try {
    const res = await axios.get(`${API_ORDER}/${userId}`, {
      headers: getAuthHeader(),
      params: { page, limit },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", err.response?.data || err);
    throw err.response?.data || err;
  }
};


export const createOrderFromCart = async (orderData) => {
  try {
    const res = await axios.post(`${API_ORDER}`, orderData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi khi tạo đơn hàng:", err.response?.data || err);
    throw err.response?.data || err;
  }
};
