import axios from 'axios';
import emailimg from '../assets/email.svg';
import pwd from '../assets/password.svg';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState('');


  const navigate=useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3030/user/login',
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        console.log('User logged in successfully');
        setLoggedIn(true);
        toast.success("Logged in successfully");
        navigate('/');
      }
      else{
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error('Error registering user', err);
      toast.error("Error : " + err.message);
    }
  };


  return (
<div className="flex flex-col gap-4 justify-center items-center bg-black h-screen">
  
  <form
    className="mt-[-70px] flex flex-col justify-center items-center gap-6 p-6 bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg border-2 border-green-600"
    onSubmit={submitForm}
  >
  <h1 className="text-white text-2xl font-semibold">Login Here!!!</h1>

    <div className="flex border-2 border-green-600 rounded-xl items-center">
    <img src={emailimg} alt='email' className='h-10 w-10 p-2'/>
      <input
        type="email"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="w-64 p-2 rounded-full bg-transparent text-white outline-none"
      />
    </div>

    <div className="flex border-2 border-green-600 rounded-xl items-center">
    <img src={pwd} alt='email' className='h-10 w-10 p-2'/>
      <input
        type="password"
        placeholder="Enter your password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="w-64 p-2 bg-transparent text-white outline-none"
      />
    </div>
    <p className='text-md text-green-600 font-semibold hover:underline hover:cursor-pointer'><Link to="/reset">Forgotten password ?</Link></p>
        <button
          type="submit"
          className="bg-green-600 text-white text-lg font-semibold px-4 py-1 rounded-md bg-opacity-70 w-full hover:bg-opacity-50"
        >
          Login
        </button>
        <p className='text-gray-200'>Don't have an account ? <span className='font-bold underline text-green-600 hover:cursor-pointer' onClick={() => navigate('/register')}>Sign Up</span></p>
      </form>
    </div>
  );
}

export default Login;   