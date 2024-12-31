import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ResetPassword() {
  const [reset, setReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));

  const navigate = useNavigate();

  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
  };

  const resetOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3030/user/reset-otp',
        { email: email },
        { withCredentials: true }
      );
      if (res.data.success) {
        // console.log('Reset email sent successfully');
        setReset(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3030/user/reset-password',
        {
          email: email,
          newPass: password,
          otp: otp.join(''),
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        console.log('Password reset successfully');
        toast.success('Password reset successfully');
        navigate('/');
        setReset(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen bg-black text-white flex justify-center items-center">
      <form className="flex flex-col mt-[-100px] gap-6 p-6 bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg justify-center border-2 border-green-600">
        <h1 className="text-white text-2xl font-semibold mb-4">Forgot Your Password?</h1>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="py-2 px-4 w-64 rounded-full bg-transparent text-white border-2 border-green-600 outline-none"
        />
        {reset && (
          <div className="flex flex-col gap-4">
            <p>Enter the 6-digit OTP sent to your email:</p>
            <div className="flex gap-2">
              {otp.map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  className="w-12 h-12 bg-green-600 bg-opacity-50 text-white text-center font-bold text-xl border-2 border-green-600 rounded-md outline-none focus:bg-opacity-90"
                  onChange={(e) => handleOtpChange(e, index)}
                />
              ))}
            </div>
            <input
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-2 px-4 w-64 rounded-full bg-transparent text-white border-2 border-green-600 outline-none"
              required
            />
            <button
              type="submit"
              onClick={handlePasswordReset}
              className="bg-green-600 bg-opacity-70 text-white text-lg font-semibold px-4 py-1 rounded-md w-full hover:bg-opacity-50"
            >
              Reset Password
            </button>
          </div>
        )}
        {!reset && (
          <button
            type="submit"
            onClick={resetOtp}
            className="bg-green-600 bg-opacity-70 text-white text-lg font-semibold px-4 py-1 rounded-md w-full hover:bg-opacity-50"
          >
            Send Email
          </button>
        )}
      </form>
    </div>
  );
}

export default ResetPassword;
