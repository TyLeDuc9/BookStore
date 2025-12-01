import axios from 'axios';
import {
  loginFailed, loginStart, loginSuccess,
  registerFailed, registerStart, registerSuccess,
  updateUserStart, updateUserSuccess, updateFailed
} from './authSlice';
import { getAuthHeader } from "../../utils/authHeader";
const API_AUTH = "http://localhost:8000/auth"
const API_USER = "http://localhost:8000/user"
export const changePassword = async (token, userData) => {
  try {
    const res = await axios.put(`${API_USER}/change-password`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, message: res.data.message || "Đổi mật khẩu thành công" };
  } catch (err) {
    console.error("API changePassword error:", err.response || err.message);

    const message = err.response?.data?.message || "Không thể kết nối server";
    return { success: false, message };
  }
};
export const loginEmployee = async (data, dispatch, navigate, setErrorMsg) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${API_AUTH}/login-email`, data);

    if (res.data.user.role !== "employee") {
      dispatch(loginFailed());
      setErrorMsg("Bạn không phải là nhân viên!");
      return null;
    }

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    dispatch(loginSuccess(res.data.user));
    navigate("/employee");

  } catch (err) {
    dispatch(loginFailed());
    const message = err.response?.data?.message || "Email hoặc mật khẩu không chính xác!";
    setErrorMsg(message);
  }
};

export const loginAdmin = async (user, dispatch, navigate, setErrorMsg) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${API_AUTH}/login-email`, user);

    const { token, user: userData } = res.data;

    if (userData.role !== "admin") {
      dispatch(loginFailed());
      setErrorMsg("Bạn không có quyền truy cập trang Admin!");
      return null;
    }
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    dispatch(loginSuccess(userData));
    setErrorMsg("");
    navigate("/admin/dashboard");

    return res.data;
  } catch (err) {
    dispatch(loginFailed());
    const message = err.response?.data?.message || "Email hoặc mật khẩu không chính xác!";
    setErrorMsg(message);
    return null;
  }
};

export const updateUser = async (id, userData, dispatch, token, setMsg) => {
  dispatch(updateUserStart());
  try {
    const res = await axios.put(`${API_USER}/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Lưu user mới vào localStorage
    localStorage.setItem("user", JSON.stringify(res.data.user));

    dispatch(updateUserSuccess(res.data.user));
    setMsg && setMsg("Cập nhật thành công!");
  } catch (err) {
    dispatch(updateFailed());
    const msg = err.response?.data?.message || "Cập nhật thất bại!";
    setMsg && setMsg(msg);
    console.error("Update error:", msg);
  }
};
// Login
export const loginUser = async (user, dispatch, setErrorMsg) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${API_AUTH}/login-email`, user);

    // Lưu token và user riêng
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    dispatch(loginSuccess(res.data.user)); // gửi user vào Redux
    setErrorMsg && setErrorMsg('');

    return res.data; // ✅ Trả về { token, user }
  } catch (err) {
    dispatch(loginFailed());
    const message = err.response?.data?.message || "Email hoặc mật khẩu không chính xác!";
    setErrorMsg && setErrorMsg(message);
    console.error("Login error:", err.response?.data || err.message);
    return null; // ✅ Trả về null nếu lỗi
  }
};

// Register
export const registerUser = async (user, dispatch, setErrorMsg) => {
  dispatch(registerStart());
  try {
    await axios.post(`${API_AUTH}/register-email`, user);
    dispatch(registerSuccess());
    setErrorMsg && setErrorMsg('');
  } catch (err) {
    dispatch(registerFailed());
    const message = err.response?.data?.message || 'Email hoặc mật khẩu không hợp lệ';
    setErrorMsg && setErrorMsg(message);
    console.error("Register error:", err);
  }
};
export const registerEmployee = async (user, dispatch, setErrorMsg) => {
  dispatch(registerStart());
  try {
    await axios.post(`${API_AUTH}/register-employee`, user, {
      headers: getAuthHeader()
    });
    dispatch(registerSuccess());
    setErrorMsg && setErrorMsg('');
  } catch (err) {
    dispatch(registerFailed());
    const message = err.response?.data?.message || 'Email hoặc mật khẩu không hợp lệ';
    setErrorMsg && setErrorMsg(message);
    console.error("Register error:", err);
  }
};