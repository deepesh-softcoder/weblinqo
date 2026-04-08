import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
  FaArrowLeft,
  FaArrowRight,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaInfo,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import api from "../../services/api";
import Avatar from "../../assets/avatar.jpg";
import logo from "../../assets/images/logos/logo-icon.png";
import useUserStore from "../../stores/userStore";
import SectionTitle from "../../pages/user/landing-page/section-title";
import useLoaderStore from "../../stores/loaderStore";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// Custom Swiper styles
const swiperStyles = `
  .template-swiper {
    padding: 0 60px;
  }
  
  .swiper-button-prev-custom,
  .swiper-button-next-custom {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #2848f0;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .swiper-button-prev-custom:hover,
  .swiper-button-next-custom:hover {
    background: #2848d5;
    transform: translateY(-50%) scale(1.05);
  }
  
  .swiper-button-prev-custom {
    left: 16px;
  }
  
  .swiper-button-next-custom {
    right: 16px;
  }
  
  .swiper-button-prev-custom.swiper-button-disabled,
  .swiper-button-next-custom.swiper-button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  
  @media (max-width: 640px) {
    .template-swiper {
      padding: 0 20px;
    }
    
    .swiper-button-prev-custom,
    .swiper-button-next-custom {
      width: 40px;
      height: 40px;
    }
    
    .swiper-button-prev-custom {
      left: 8px;
    }
    
    .swiper-button-next-custom {
      right: 8px;
    }
  }
`;

const TemplateSlider = () => {
  const [templates, setTemplates] = useState([]);
  const { isAuthenticated } = useUserStore();
  const { showLoader, hideLoader } = useLoaderStore();

   // Define social platforms to display on each card
  const socialPlatforms = [
    { name: "Instagram", icon: <FaInstagram /> },
    { name: "Twitter", icon: <FaXTwitter /> },
    { name: "LinkedIn", icon: <FaLinkedinIn /> },
  ];

  // Define contact items for card footer
  const contactItems = [
    {
      icon: <FaEnvelope />,
      text: "website",
      url: "#",
      ariaLabel: "Send Email",
    },
    { icon: <FaPhone />, text: "website", url: "#", ariaLabel: "Call" },
  ];

  // fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      showLoader();
      try {
        const response = await api.get("/api/v1/template/");
        setTemplates(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        hideLoader();
      }
    };
    fetchTemplates();
  }, []);

  return (
    <>
      <style>{swiperStyles}</style>
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        {/* header */}
        <SectionTitle
          title={"Link In BioTemplates"}
          style={"mt-[20px] mb-6"}
          color={"text-primary"}
        />

         {/* Swiper slider container */}  
        <div className="w-full relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className={`${window.innerWidth < 640 ? "template-swiper" : ""}`}
          >
            {/* Map over templates to create slides */}
            {templates.map((template, idx) => (
              <SwiperSlide key={idx} className="px-0">
                <div
                  className="rounded-xl relative overflow-hidden h-[500px]"
                  style={{
                    // aspectRatio: "9/16",
                    background: template.backgroundImageUrl
                      ? `url(${template.backgroundImageUrl}) center/cover no-repeat`
                      : template.background ??
                        template.backgroundColor ??
                        "#ffffff",
                    color: template.textColor || "#333333",
                    fontFamily: template.font || "inherit",
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity z-10">
                    <a
                      href={isAuthenticated ? "/dashboard" : "/signup"}
                      className="bg-primary hover:bg-white text-white hover:text-primary border-2 border-primary font-semibold px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-105"
                    >
                      Choose Template
                    </a>
                  </div>

                  {/* Card content */}
                  <div className="flex flex-col items-center h-full p-6 relative z-0">
                    <img
                      src={template.imageUrl || Avatar}
                      alt="avatar"
                      className="w-20 h-20 rounded-full border-2 border-white shadow-md mb-3 object-cover"
                    />
                    <h4 className="font-semibold text-size-20 text-center mb-2 text-white">
                      {template.name}
                    </h4>
                    <div className="flex items-center justify-center gap-3 my-2">
                      <FaInfo className="cursor-pointer text-white" />
                      <FaEnvelope className="cursor-pointer text-white" />
                      <FaPhone className="cursor-pointer text-white" />
                    </div>
                    <p className="text-center text-size-14 mb-2 text-white opacity-80">
                      {template.bio || "No bio provided."}
                    </p>

                    <div className="flex gap-3 mb-3">
                      {socialPlatforms.map((platform) => (
                        <div
                          key={platform.name}
                          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition`}
                        >
                          <span className="text-white">{platform.icon}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto space-y-2 w-full">
                      {contactItems.map((item, idx) => (
                        <a
                          key={idx}
                          href={item.url}
                          className="flex items-center justify-between w-full bg-white rounded-full py-1 px-3 text-sm text-gray-800 hover:bg-gray-300 transition"
                        >
                          <span>{item.icon}</span>
                          <span className="font-medium text-center text-size-12">
                            {item.text}
                          </span>
                          <span></span>
                        </a>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-4">
                      <img
                        src={logo}
                        alt="logo"
                        className="h-10 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute -translate-y-1/2 left-0 md:-left-4 z-10 bg-[#2848f0] text-white hover:bg-[#2848d5] hover:text-[#fff] rounded-full p-3 shadow-md transition cursor-pointer">
            <FaArrowLeft />
          </button>
          <button className="swiper-button-next-custom absolute -translate-y-1/2 right-0 md:-right-4 z-10 bg-[#2848f0] text-white hover:bg-[#2848d5] hover:text-[#fff] rounded-full p-3 shadow-md transition cursor-pointer">
            <FaArrowRight />
          </button>
        </div>
      </div>
    </>
  );
};

export default TemplateSlider;
