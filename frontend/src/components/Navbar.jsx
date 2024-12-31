import React from 'react'
import Login from "./Login";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../assets/logo.svg";
function Navbar() {
    const [loggedIn,setLoggedIn]=useState(false);
    const [user,setUser]=useState([]);
    const [showOptions,setShowOptions]=useState(false);

    const navigate=useNavigate();

    useEffect(() => {
        checkLogin();
    }, [loggedIn]);

    useEffect(() => {
        if (loggedIn) {
            getUserDetails();
        }
    }, [loggedIn]);

    const getUserDetails=async()=>{
        try {
            const res = await axios.get(
              'http://localhost:3030/user/userData',
              {
                withCredentials: true,
              }
            );
            if (res?.data?.success) {
            //   console.log('User logged in successfully :', res.data.data);
              setUser(res?.data?.data ||  []);
              localStorage.setItem('username', res.data.data.name);
            }
            else{
              console.log(res.data.message);
            }
          }
        catch(error){
            console.error(error);
        }
    }

    const checkLogin=(async()=>{
        try {
            const res = await axios.post(
              'http://localhost:3030/user/auth',
              {},
              {
                withCredentials: true,
              }
            );
            if (res.data.success) {
              console.log('res', res.data);
              setLoggedIn(true);
            }
            else{
              console.log(res.data.message);
            }
          }
        catch(error){
            console.error(error);
        }
    })

    const handleToggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const sendotp = async () => {
      try {
        const res = await axios.post(
          'http://localhost:3030/user/send-otp',
          {},
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          console.log('OTP shared');
          toast.success("OTP is now available");
          navigate('/verify-email'); // Redirect to verify email page
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error sending OTP");
      }
    };
    

    const logout = async(e) => {
        e.preventDefault();
        try{
            const res = await axios.get(
                'http://localhost:3030/user/logout',
                {
                  withCredentials: true,
                }
              );
              if (res.data.success) {
                localStorage.removeItem('username');
                setLoggedIn(false);
                toast.success('Logged out successfully');
              }
              else{
                toast.error(res.data.message);
              }
          }
          catch(error){
              console.error(error);
          }
      }
  return (
    <div className='text-white bg-black flex justify-between p-4 items-center'>
        <div className='h-12 w-16'><img src={logo}/></div>
        <div className='flex gap-4 items-center font-bold'>
        <h1 className='text-green-600 text-lg hover:underline hover:cursor-pointer' onClick={()=>navigate('/')}>Home</h1>
        {loggedIn && user?.name ? (
                <div>
                    <div
                        className="relative cursor-pointer"
                        onClick={handleToggleOptions}
                    >
                        <span className="border-2 border-green-600 font-bold p-2 px-4 rounded-full text-2xl text-green-600">
                            {user.name[0].toUpperCase()}
                        </span>
                        {showOptions && (
                            <div className="absolute top-12 left-[-30px] shadow-md rounded-md border-2 ">
                                <ul className="text-left text-white">
                                {
                                    !user.isAccountVerified &&  <li className="p-2 border-b-2 border-white hover:bg-green-80 cursor-pointer hover:text-green-400" onClick={sendotp}>
                                       <Link to={'/verify-email'}>Verify Account</Link> 
                                    </li>
                                }
                                   
                                    <li className="p-2 hover:bg-green-80 cursor-pointer hover:text-green-400 " onClick={logout}>
                                        Logout
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <Link to="/Login">
                    <button className="text-xl text-white font-semibold border-2 border-green-600 py-1 px-4 rounded-lg hover:border-black hover:bg-green-600 hover:text-black">
                        Login
                    </button>
                </Link>
            )}
        </div>
    </div>
  )
}

export default Navbar