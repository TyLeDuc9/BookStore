import axios from "axios";
import { getAuthHeader } from "../utils/authHeader";
// const API_SHIPPING_ADDRESS = "http://localhost:8000/shipping-address";
const API_SHIPPING_ADDRESS = "https://bookstore-backend-vovp.onrender.com/shipping-address";
export const getAddressById = async (id) => {
    try {
        const res = await axios.get(`${API_SHIPPING_ADDRESS}/by/${id}`)
        return res.data
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message);
    }
}
export const adminUpdateAddress = async (id, data) => {
    try {
        const res = await axios.put(`${API_SHIPPING_ADDRESS}/${id}`, data, {
            headers: getAuthHeader()
        })
        return res.data

    } catch (err) {
        throw new Error(err.response?.data?.message || err.message);
    }
}
export const getAllAddress = async ({ page = 1, limit = 20, sort = "newest" }) => {
    try {
        const res = await axios.get(`${API_SHIPPING_ADDRESS}/grouped`, {
            params: { page, limit, sort },
            headers: getAuthHeader()
        });
        return res.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message);
    }
};