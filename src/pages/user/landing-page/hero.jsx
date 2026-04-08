import React, { memo } from "react";
import socialImg from '../../../assets/images/svg/socialMediaHeroImg.svg'
import { Link } from "react-router-dom";
import useUserStore from '../../../stores/userStore';
import Avatar from '../../../assets/avatar.jpg';
import { FaEnvelope, FaInfo, FaInstagram, FaLinkedinIn, FaPhone } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from '../../../assets/images/logos/logo-icon.png';
import Typography from "../../../components/shared/typography";
import Button from "../../../components/shared/button";

const Hero = () => {
    const { isAuthenticated } = useUserStore();

    const socialPlatforms = [
        { name: "Instagram", icon: <FaInstagram /> },
        { name: "Twitter", icon: <FaXTwitter /> },
        { name: "LinkedIn", icon: <FaLinkedinIn /> },
    ];

    const contactItems = [
        {
          icon: <FaEnvelope />,
          text: "website",
          url: "#",
          ariaLabel: "Send Email",
        },
        { icon: <FaPhone />, text: "website", url: "#", ariaLabel: "Call" },
    ];

    return (
        <section className="px-6 py-16 max-w-7xl mx-auto" >
            <div className='flex justify-between gap-10 flex-col lg:flex-row'>
                {/* left */}
                <div className='max-w-[100%] md:max-w-[100%] lg:max-w-[70%]'>
                    <i>
                        <Typography variant="h1" className="text-center lg:text-start m-0">
                            One link. One card. Infinite connections — with forms, booking, and campaigns built in
                        </Typography>
                    </i>
                    
                    <div className='flex items-center mt-10 gap-10 lg:justify-between justify-center flex-col lg:flex-row'>
                        <div className='flex items-center justify-start flex-col lg:items-start'>
                            <Typography variant="p" className='text-size-18 text-gray-400 text-center lg:text-start md:w-[60%] w-[80%]'>
                                Build your digital presence in minutes.
                                Weblinqo helps creators, businesses, and professionals connect everything in one place — from links to websites, business cards, campaigns, and more.
                            </Typography>
                            <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="mt-14">
                                <Button variant="gradient" className="rounded-full px-6 py-2">
                                    Get Started for Free
                                </Button>
                            </Link>
                        </div>
                        <img 
                            src={socialImg} 
                            className='w-full max-w-[262px] aspect-square lg:mr-20' 
                            alt="social hero" 
                            loading="eager" // Hero image should load as fast as possible
                            fetchpriority="high"
                        />
                    </div>
                </div>

                {/* right */}
                <div className='flex justify-center lg:justify-start'>
                    <div style={{background: 'linear-gradient(180deg, #E0E0E9, #9B6D5B)'}} className="w-[290px] max-w-[290px] text-white rounded-xl h-[500px] lg:mt-12">
                    <div className="flex flex-col items-center h-full p-6 relative z-0">
                        <img 
                            src={Avatar} 
                            alt="avatar" 
                            className="w-20 h-20 rounded-full border-2 border-white shadow-md mb-3 object-cover"
                            loading="lazy"
                        />
                        <div className="flex items-center justify-center gap-3 my-2">
                            <FaInfo className="cursor-pointer text-brown" />
                            <FaEnvelope className="cursor-pointer text-brown" />
                            <FaPhone className="cursor-pointer text-brown" />
                        </div>
                        <Typography variant="span" className="text-center text-size-14 mb-2 text-brown opacity-80">No bio provided.</Typography>
                        <div className="flex gap-3 mb-3">
                        {socialPlatforms.map((platform) => (
                            <div key={platform.name} className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition`}>
                                <span className="text-brown">{platform.icon}</span>
                            </div>
                        ))}
                        </div>
                        <div className=" space-y-2 w-full">
                        {contactItems.map((item, idx) => (
                            <a key={idx} href={item.url} className="flex items-center justify-between w-full bg-brown border border-white border-1 rounded-full py-1 px-3 text-sm text-white">
                                <span>{item.icon}</span>
                                <Typography variant="span" className="font-medium text-center text-size-12">{item.text}</Typography>
                                <span></span>
                            </a>
                        ))}
                        </div>
                        <div className="flex gap-3 mt-4 mt-auto">
                            <img src={logo} alt="logo" className="w-10 h-10" loading="lazy" />
                        </div>
                    </div>             
                    </div>
                </div>
            </div>
        </section >
    )
}

export default memo(Hero);
