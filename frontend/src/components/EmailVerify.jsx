import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function EmailVerify() {
  const [otp, setOtp] = useState(Array(6).fill(''));

  const navigate=useNavigate();

  // Handle OTP input change
  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
  };

  const otpString = otp.join('');
  console.log(otpString);

  const verifyAccount = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3030/user/verify-otp',
        {
          otp: otpString,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        console.log('Account verified');
        toast.success('Account is verified');
        navigate('/');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen bg-black text-white flex justify-center items-center">
      <form className="mt-[-100px] flex flex-col gap-6 p-6 bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg border-2 border-green-600">
        <h1 className="text-white text-2xl font-semibold mb-4">Verify Your Email</h1>
        <p className="text-gray-300 text-lg">Enter the 6-digit code sent to your email:</p>
        <div className="flex gap-2 justify-center mb-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-green-600 bg-opacity-50 text-white text-center font-bold text-xl border-2 border-green-600 rounded-md outline-none focus:bg-opacity-90"
                onChange={(e) => handleOtpChange(e, index)}
              />
            ))}
        </div>
        <button
          type="submit"
          onClick={verifyAccount}
          className="bg-green-600 text-white text-lg font-semibold px-4 py-1 rounded-md bg-opacity-70 w-full hover:bg-opacity-50"
        >
          Verify
        </button>
      </form>
    </div>
  );
}

export default EmailVerify;
