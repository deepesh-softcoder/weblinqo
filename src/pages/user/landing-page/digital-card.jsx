import { useLocation } from "react-router-dom";
import DigitalCardHero from "./digital-card-hero";
import DigitalCardSlider from "../../../components/slider/digital-card-slider";

const DigitalCardTemp = () => {
  const location = useLocation();

  return (
    <>
    <div className="bg-offWhite">

      {/* Displaying Digiotal card hero section and slider on digital card page */}
      {location.pathname === "/digital-card-templates" && <DigitalCardHero />}
      <DigitalCardSlider />
    </div>
    </>
  );
};

export default DigitalCardTemp;