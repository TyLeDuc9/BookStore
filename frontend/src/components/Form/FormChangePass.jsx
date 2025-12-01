import React, { useState } from "react";
import { Title } from "../Title/Title";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { changePassword } from "../../redux/Auth/authApi";
import useTogglePassword from '../../hooks/useTogglePassword';
export const FormChangePass = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { showPassword, togglePassword } = useTogglePassword();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setMessage("");
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Vui lòng đăng nhập lại!");
      setLoading(false);
      return;
    }

    try {
      const result = await changePassword(token, formData);
      setMessage(result.message);
    } catch (err) {
      console.error(err);
      setMessage("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div>
      <Title title="Đổi mật khẩu" className="lg:text-lg text-sm mb-6" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="lg:w-1/4 w-2/5 text-[#3a606e] font-medium lg:text-lg sm:text-base text-xs">Mật khẩu hiện tại</label>
          <input
            type={showPassword ? "text" : "password"}
            name="oldPassword"
            placeholder="Mật khẩu hiện tại"
            value={formData.oldPassword}

            onChange={handleChange}
            className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2
             focus:ring-[#3a606e] lg:text-base sm:text-base text-xs"
          />
          <span
            className=" transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
            onClick={togglePassword}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <label className="lg:w-1/4 w-2/5 text-[#3a606e] font-medium lg:text-lg sm:text-base text-xs">Mật khẩu mới</label>
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            placeholder="Mật khẩu mới"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 
            focus:ring-[#3a606e] lg:text-base sm:text-base text-xs"
          />
          <span
            className=" transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
            onClick={togglePassword}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <label className="w-2/5 lg:w-1/4 text-[#3a606e] font-medium lg:text-lg sm:text-base text-xs">Xác nhận mật khẩu mới</label>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu mới"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-3/4 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 
            focus:ring-[#3a606e] lg:text-base sm:text-base text-xs"
          />
          <span
            className=" transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
            onClick={togglePassword}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#3a606e] text-white lg:text-base sm:text-base text-sm lg:px-6 px-4 py-2 rounded-lg hover:bg-[#2b4a57] ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </div>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-[#3a606e]">{message}</p>
      )}
    </div>
  );
};
