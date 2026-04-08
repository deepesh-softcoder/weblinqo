import { toBlob } from "html-to-image";
import { useRef } from "react";
import { HiDownload } from "react-icons/hi";
import useLoaderStore from "../../stores/loaderStore";

const DownloadCard = ({ children }) => {

    // Ref to capture the card's DOM element
    const cardRef = useRef();
    const {showLoader, hideLoader} = useLoaderStore();

     // Function to handle download logic
    const download = async () => {
        showLoader();
        if (cardRef.current === null) return;
        const blob = await toBlob(cardRef.current, { cacheBust: true });
        if (blob) {
            const link = document.createElement("a");
            link.download = "card.png";
            link.href = URL.createObjectURL(blob);
            link.click(); 
        }
        hideLoader();
    }

    return (
        <div className="relative">
            {/* The card content to be captured as an image */} 
            <div ref={cardRef}>{children}</div>
            {/* Download button positioned at the top-right corner of the card */}
            <div onClick={download} className="bg-white rounded-full p-1 absolute -top-[.6rem] -right-[.6rem] border border-gray-200 shadow-xl cursor-pointer hover:bg-gray-100 z-50">
                <HiDownload size={"1.5rem"} color="#2848f0" />
            </div>
        </div>
    );
}

export default DownloadCard;