import axios from "axios";
import { getAuthHeader } from "../utils/authHeader";
const API_RATING = "http://localhost:8000/rating";
export const deleteRatingBook = async (id) => {
    const res = await axios.delete(`${API_RATING}/${id}`, {
        headers: { ...getAuthHeader(), }, 
    })
    return res.data
}
export const getAllRating = async ({ page = 1, limit = 20, sort = "newest", }) => {
    const res = await axios.get(`${API_RATING}/summary`, {
        headers: { ...getAuthHeader(), },
        params: { page, limit, sort },
    })
    return res.data
}