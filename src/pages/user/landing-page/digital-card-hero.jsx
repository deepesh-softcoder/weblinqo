import Image2 from "../../../assets/imgdgpage.png";
import Rectangle from "../../../assets/Rectangle.png";

// digiatal card hero section
const DigitalCardHero = () => {
  return (
    <div className="pt-20">
      <div className="flex justify-between lg:flex-row md:flex-col flex-col gap-10 mx-8">
        <div className="relative lg:w-[50%] md:w-[100%] w-[100%] flex items-center">
          <h1 className="whitespace-pre-line text-center md:text-left text-size-24 md:text-size-32 font-medium text-gray-700 relative z-10 tracking-wider leading-[1.2]">
            A Digital Card is your smart, all-in-one identity. With Weblinqo,
            you can create a professional card in minutes—add your name, logo,
            bio, and links, then share it anywhere with a unique URL or QR code.
            It's fast, secure, and the easiest way to showcase who you are and
            what you do.
          </h1>
          <div className="bg-white lg:w-[520px] lg:h-[520px] md:w-[380px] md:h-[380px] w-[260px] h-[260px] rounded-full border-[1px] border-[#d9d9d7] absolute lg:top-[-4rem] md:top-[-3.5rem] top-[-3rem] lg:left-[35%] md:left-[35%] left-[15%]">
          </div>
        </div>
        <div className="relative flex flex-col items-center lg:w-[35%] md:w-[100%] w-[100%] lg:right-[-1rem] lg:mt-0 md:mt-36 mt-10">
          <div className="shadow-[inset_0_4px_6px_-1px_rgba(0,0,0,0.1)] border-[1px]">
            <img
              src={Image2}
              alt=""
              className="lg:w-[490px] md:w-[470px] w-[400px] lg:h-[282px] object-cover"
            />
          </div>
          <p
            style={{
              background:
                "linear-gradient(90deg,#F76953, #FC2A71, #AD71F6, #34B5D5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            className="lg:text-[38px] md:text-[32px] text-[28px] font-semibold bg-[linear-gradient(90deg,#F76953, #FC2A71, #AD71F6, #34B5D5)] bg-clip-text text-transparent"
          >
            Ready Template To Use
          </p>
        </div>
      </div>
      <img
        src={Rectangle}
        alt="rectangle"
        className="lg:mt-36 md:mt-18 mt-10 object-cover w-full"
      />
    </div>
  );
};

export default DigitalCardHero;
