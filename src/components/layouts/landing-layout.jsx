import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../common/navigation/navbar';
import Footer from '../../pages/user/landing-page/footer';

const LandingLayout = () => {
  const location = useLocation();
  
  // Check if current route is an auth page
  const isAuthPage = ['/signup', '/login', '/forgot-password', '/verify'].includes(location.pathname);

  // check if the current route is  for verification page
  const isVerifyPage = ['/verify'].includes(location.pathname);
  
  return (
    <>
      {/* Show Navbar except on verification page */}
      {!isVerifyPage && <Navbar />}

      {/* Render page content */}
      <main className={isAuthPage ? 'min-h-[calc(100vh-75px)] flex justify-center items-center bg-offWhite' : ''}>
        <Outlet />
      </main>

      {/* Show footer and copyright only on not auth pages */}
      {!isAuthPage && (
        <>
          <Footer />
          {/* Copyright */}
          <div className="w-full flex justify-center">
            <div className="space-y-6 bg-primary py-3 px-6 w-full">
              <p className="text-size-14 text-white text-center font-medium leading-normal">
                weblinqo © 2025. All rights reserved.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LandingLayout;

