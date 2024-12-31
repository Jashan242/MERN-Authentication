import { useEffect, useState } from "react";
import robo from "../assets/robo.svg";
import Navbar from "./Navbar";
import axios from "axios";
const Home=()=>{
    const [user,setUser]=useState([]);
     useEffect(() => {
            // if (loggedIn) {
                getUserDetails();
            // }
        }, []);
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

    const username = localStorage.getItem("username");
    
    return(
        <div className="flex flex-col h-screen bg-black">
            <div className="flex justify-center items-center gap-10 mt-[-50px]">
                <div className="flex flex-col text-white">
                <h1 className="text-green-600 text-6xl font-bold mb-4">Heyy {username ? username : "Developer"} 👋</h1>
                {/* {username ? <h1>Hey {username} 👋</h1> : <h1>Hey Developer 👋</h1>} */}
                <h3 className="text-xl font-semibold">Welcome to the developers community</h3>
                <h3 className="text-xl font-semibold">This is a platform for developers to connect, share, and learn</h3>
            
            </div>
            <div>
                <img src={robo} alt="robot"></img>
            </div>
            
        </div>
        </div>
    )
}

export default Home;