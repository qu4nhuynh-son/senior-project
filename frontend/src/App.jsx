import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 

import 'aos/dist/aos.css';
import './css/style.css';

import AOS from 'aos';

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import CreateProfile from './pages/CreateProfile'; // Import trang CreateProfile
import Chatbot from "./components/chatbot/Chatbot";
import UseCase from "./pages/UseCase";
import Dashboard from "./pages/Dashboard";
import UpcomingCalendarPage from "./components/panel/calendar/UpcomingCalendarPage";
import TodayContent from "./components/panel/TaskToday/TodayContent";

function App() {
  const location = useLocation();
  


  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 700,
      easing: 'ease-out-cubic',
    });
  }, []);

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]); // triggered on route change

  return (
    <>
    
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/create-profile" element={<CreateProfile />} /> {/* Thêm route này */}
        <Route path="/use-case" element={<UseCase />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/upcoming" element={<UpcomingCalendarPage />} />
        <Route path="/today" element={<TodayContent />} />
        
      </Routes>
      

      <Chatbot /> 
      {/* ✅ Toaster UI nằm cuối cùng trong App để xuất hiện mọi nơi */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            background: '#fff',
            color: '#333',
            boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ecfdf5',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fee2e2',
            },
          },
        }}
      />
        
    </>
  );
}

export default App;
