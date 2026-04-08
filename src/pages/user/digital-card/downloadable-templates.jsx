import { FaEnvelope, FaHome, FaPhone } from "react-icons/fa";
import DownloadCard from "../../../components/features/download-card";

// card one
const DgCardOne = ({ userDcProfile }) => {
  return (
    <DownloadCard>
      <div className="max-w-full w-full h-[13rem] aspect-video bg-white shadow-md border border-[#e6e5ea] relative">
        <div className="h-[60%] w-[40%] rounded-br-[5rem] bg-[#e6e5ea] flex justify-center items-center">
          <img
            src={userDcProfile?.avatar}
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto border-2 border-white object-cover p-1"
          />
        </div>
        <div className="absolute top-0 right-[0.5rem]">
          {/* <img src={Logo} alt="logo" className="w-10 h-10 rounded-full mx-auto object-cover" /> */}
        </div>
        <img
          src={`https://api.staging.weblinqo.com/qr-codes/${userDcProfile?.qrId}.png`}
          alt="QR Code"
          className="lg:w-20 lg:h-20 md:w-20 md:h-20 w-[4rem] h-[4rem] rounded-lg object-cover ml-5 lg:mt-0 md:mt-0 mt-2"
        />
        <div className="absolute h-[70%] w-[65%] bottom-0 right-0 rounded-tl-[6rem] bg-[#2d3a42] flex items-center justify-end">
          <div className="flex flex-col gap-1 p-4">
            <div className="mb-2 flex flex-col items-end justify-end">
              <h1 className="font-semibold text-white text-lg capitalize break-words line-clamp-2">
                {userDcProfile?.name}
              </h1>
              <p className="font-medium text-white text-size-12">
                {userDcProfile?.designation}
              </p>
            </div>
            <div>
              {!(userDcProfile?.phone === null) && (
                <div className="flex gap-2 items-center justify-end">
                  <h1 className="font-medium text-white text-size-12 text-right">
                    {userDcProfile?.phone}
                  </h1>
                  <FaPhone size={".8rem"} color="white" />
                </div>
              )}
              {!(userDcProfile?.address === null) && (
                <div className="flex gap-2 items-center justify-end">
                  <h1 className="font-medium text-white text-size-12 break-words line-clamp-2 text-right">
                    {userDcProfile?.address}
                  </h1>
                  <div>
                    <FaHome size={".8rem"} color="white" />
                  </div>
                </div>
              )}
              {!(userDcProfile?.email === null) && (
                <div className="flex gap-2 items-center justify-end">
                  <h1 className="font-medium text-white text-size-12 text-right">
                    {userDcProfile?.email}
                  </h1>
                  <FaEnvelope size={".8rem"} color="white" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DownloadCard>
  );
};

export { DgCardOne, DgCardTwo, DgCardThree, DgCardFour };
