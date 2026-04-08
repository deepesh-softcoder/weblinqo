import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaPinterestP, FaTiktok } from 'react-icons/fa';
import logoIcon from '../../../assets/images/logos/logo-icon.png'
import linkApi from '../../../services/linkApi';
import toast from 'react-hot-toast';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail]= useState('');
  const [consent, setConsent] = useState(false);


  // display Pop up message apply on social links
  // const handleSocialClick = () => {
  //   setShowPopup(true);
  //   // Auto-hide popup after 2 seconds
  //   setTimeout(() => {
  //     setShowPopup(false);
  //   }, 5000);
  // };

  // Handle email newsletter submission
  const handleEmailSubmit= async ()=>{
    if (!email.trim()) {
      toast.error("Email cannot be empty.");
      return;
    }

    if (!consent) {
      toast.error("You must agree to the Privacy Policy and Terms before subscribing.");
      return;
    }

    try {
      const response = await linkApi.subscribeNewsletter(email);

      if(response?.status === "SUCCESS"){
        toast.success(response?.message);
        setEmail('')
      }else{
        console.log('something went wrong'); 
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }

  }

  return (
    <footer className="bg-black text-white px-6 md:px-20 py-10 flex flex-col justify-between md:flex-row gap-10 relative">
      {/* Coming Soon Popup */}
      {showPopup && (
        <div onClick={()=>setShowPopup(false)} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black px-8 py-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Coming Soon!</h3>
            <p className="text-gray-600">This page is under development.</p>
          </div>
        </div>
      )}

      {/* Left Side */}
      <div className='flex md:items-start flex-col items-center gap-2 justify-center'>
        <div className='mb-5'>
            <img src={logoIcon} className='h-20'/>
        </div>
        <p className="text-logoGolden tracking-wider text-size-24 font-semibold">The only platform to grow your brand!</p>

        {/* Email newsletter form  */}
        <div className="flex mt-7 mb-7 p-3 border-1 border border-white rounded-sm grow w-full max-w-[470px]">
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="enter your email address"
            className="px-3 py-3 w-full max-w-xs text-white bg-charCoalBlack outline-none grow"
          />
          <button 
            onClick={handleEmailSubmit}
            className="text-white px-5 py-2 disabled:opacity-50"
            disabled={!email.trim() || !consent}>
              SUBMIT
          </button>
        </div>

        {/* Privacy consent checkbox */}
        <div className="flex items-start mb-7">
           <input 
              type="checkbox" 
              checked={consent} 
              onChange={(e)=>setConsent(e.target.checked)} 
              className="mr-2 mt-1" 
            />
          <p className="text-size-14 text-white font-normal leading-normal">
            By providing your email, you consent to our Privacy<br />
            Policy and Terms & Conditions.
          </p>
        </div>

        {/* Social media icons */}
        <p className="mb-2 font-normal text-size-16">Follow Us</p>
        <div className="flex gap-4 text-lg">
          <a href='https://www.facebook.com/share/1DW43odh33/?mibextid=wwXIfr'>
            <FaFacebookF 
              className="cursor-pointer hover:text-logoGolden transition-colors duration-200" 
            />
          </a>
          <a href='https://www.tiktok.com/@weblinqo?_t=ZT-90aUAklbmat&_r=1'>
            <FaTiktok 
              className="cursor-pointer hover:text-logoGolden transition-colors duration-200" 
            />
          </a>
          <a href='https://x.com/weblinqo124159?s=21'>
            <FaXTwitter className="cursor-pointer hover:text-logoGolden transition-colors duration-200" />
          </a>
        </div>
      </div>
      <div className='bg-white w-[1px] h-[430px] hidden md:block'/>
      <div className='bg-white w-full h-[1px] block md:hidden'/>
      {/* Right Side */}
      <div className="grid grid-cols-2 gap-10 text-sm text-gray-300">
        <div className='flex  items-center flex-col space-y-6'>
          <h2 className="font-semibold text-size-16">Information</h2>
          <ul className='space-y-6'>
            <li className="text-size-14 font-normal hover:underline cursor-pointer"><a href='/about'>About</a></li>
          </ul>
        </div>
        <div className='flex items-center flex-col space-y-6'>
          <h2 className="font-semibold text-size-16">Customer Service</h2>
          <ul className='space-y-6'>
            <li className="hover:underline cursor-pointer text-size-14 font-normal"><a href="/privacy">Privacy Policy</a></li>
            <li className="hover:underline cursor-pointer text-size-14 font-normal"><a href="/terms">Terms & Conditions</a></li>
            <li className="hover:underline cursor-pointer text-size-14 font-normal"><a href="/contact">Contact Us</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
