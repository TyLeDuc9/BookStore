import axios from 'axios'
import { getAuthHeader } from "../utils/authHeader";
// const API_CART = "http://localhost:8000/cart";
const API_CART = "https://bookstore-backend-wy3q.onrender.com/cart";
export const deleteCartId = async (id) => {
    try {
        const res = await axios.delete(`${API_CART}/${id}`, {
            headers: getAuthHeader(),
        })
        return res.data
    } catch (err) {
        throw new Error(err.response?.data?.message);
    }
}
export const getAllCart = async ({ page = 1, limit = 20, sort = "newest" }) => {
    try {
        const res = await axios.get(`${API_CART}/all`, {
            headers: getAuthHeader(),
            params: { page, limit, sort },
        })
        return res.data
    } catch (err) {
        throw new Error(err.response?.data?.message);
    }
}