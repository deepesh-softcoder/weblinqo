import React from "react";
import customizeImg from '../../../assets/images/svg/customizeImg.svg'
import SectionTitle from "./section-title";

// landing page section
const Customize = () => {
    return (
        <>
            <SectionTitle title={'Create and customize your Weblinqo in minutes'} />
            <section className='bg-white'>
                <div className='max-w-7xl mx-auto flex justify-between flex-col pt-5 lg:pt-0 lg:flex-row items-center'>
                    <div className='flex items-center flex-col justify-center md:w-[50%] w-[90%]'>
                        <h2 className='text-center font-bold text-gray-400 text-size-14 px-3 sm:text-size-18 leading-8'>Vision</h2>
                        <p className='text-center font-normal text-gray-400 text-size-14 px-3 sm:text-size-18 leading-8'>
                        To empower individuals and businesses to own and control their online presence — beautifully, simply, and intelligently.
                        </p>
                        <h2 className='text-center font-bold text-gray-400 text-size-14 px-3 sm:text-size-18 leading-8'>Mission</h2>
                        <p className='text-center font-normal text-gray-400 text-size-14 px-3 sm:text-size-18 leading-8'>
                        We are building an all-in-one platform that helps you connect your audience, grow your brand, and scale your business without coding or complexity.
                        </p>
                    </div>
                    <div>
                        <img src={customizeImg} className='w-full aspect-square' />
                    </div>
                </div>
            </section></>
    )
}

export default Customize;