import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import EmailVerify from './components/EmailVerify';
import Register from './components/Register';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';

function Layout() {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <Navbar />
      <div className="flex-1">
        <Outlet /> {/* This is where child routes will be rendered */}
      </div>
    </div>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />, // Layout wraps all components with the Navbar
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/register',
          element: <Register />,
        },
        {
          path: '/reset',
          element: <ResetPassword />,
        },
        {
          path: '/verify-email',
          element: <EmailVerify />,
        },
      ],
    },
  ]);

  return (
    <div>
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
