import Gradient from '../assets/gradient.jpg';
import { BiLogoMastercard } from "react-icons/bi";
import PymtIcon from '../assets/pymticon.png';
import PayPass from '../assets/PayPass.png';
import { useNavigate } from 'react-router-dom';
import Button from '../components/shared/button';
import Input from '../components/shared/input';
import Typography from '../components/shared/typography';

// payment page
const PaymentPage = () => {

    const navigate = useNavigate();

    return (
        <div className="bg-[#F5F3F0] min-h-screen">
            <Typography variant="h1" className="text-2xl font-bold text-gray-900 p-4">Weblinqo</Typography>
            <div className='flex items-center justify-center lg:py-8 md:py-12 py-16 px-4'>
                <div className="bg-white w-full max-w-md h-auto shadow-sm border-[1px] border-[#E9EAEB] rounded-2xl p-5">
                    <div className='flex justify-center relative mb-5'>
                        <img src={Gradient} className='lg:h-[15rem] lg:w-[25rem] md:h-[13rem] md:w-[23rem] h-[11rem] w-[21rem] object-cover rounded-xl' alt="card background" />
                        <div className='lg:w-[19rem] lg:h-[11rem] md:w-[18rem] md:h-[10rem] w-[17rem] h-[9rem] absolute lg:top-[2.2rem] md:top-[2.2rem] top-[1.4rem] rounded-2xl bg-white/30 backdrop-blur-md border border-white'>
                            <div className='flex justify-between items-center mx-4 my-2'>
                                <Typography variant="span" className='text-md text-white'>Untitled.</Typography>
                                <img src={PayPass} alt="paypass" />
                            </div>
                            <div className='flex items-center mx-4 my-2 w-full absolute bottom-1 justify-between'>
                                <div className='flex flex-col'>
                                    <div className='flex justify-between items-center'>
                                        <Typography variant="span" className='text-sm text-white'>OLIVIA RHYE</Typography>
                                        <Typography variant="span" className='text-sm text-white ml-2'>06/28</Typography>
                                    </div>
                                    <Typography variant="p" className='text-md text-white lg:tracking-[0.2em] md:tracking-[0.15em] tracking-[0.15em]'>1234 1234 1234 1234</Typography>
                                </div>
                                <div className='lg:mr-7 md:mr-6 mr-5 bg-white/5 backdrop-blur-sm px-2 rounded-lg'>
                                    <BiLogoMastercard color='white' size={'1.8rem'} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Typography variant="h4" className='text-[#181D27] text-lg mb-1'>Update payment method</Typography>
                    <Typography variant="p" className='text-[#717680] text-sm font-extralight mb-5'>Update your card details.</Typography>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                            <Input
                                label="Name on card"
                                type='text'
                                placeholder='Enter name on card'
                                id="cardName"
                            />
                            <div className='flex flex-col'>
                                <Typography variant="label">Expiry</Typography>
                                <div className='flex gap-1 items-center border-[1px] border-[#D5D7DA] rounded-xl py-2 px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all'>
                                    <input type='text' placeholder='Date' className='w-full text-sm focus:outline-none bg-transparent text-gray-800 placeholder-gray-400' />
                                    <span className='text-[#9ca3af]'>/</span>
                                    <input type='text' placeholder='Year' className='w-full text-sm focus:outline-none bg-transparent pl-1 text-gray-800 placeholder-gray-400' />
                                </div>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                            <Input
                                label="Card Number"
                                type='text'
                                placeholder='Enter card number'
                                leftIcon={<img src={PymtIcon} className='w-6' alt="payment icon" />}
                            />
                            <Input
                                label="CVV"
                                type='text'
                                placeholder='Enter CVV'
                            />
                        </div>
                        <div className='flex gap-3'>
                            <Button 
                                variant="secondary" 
                                size="full"
                                onClick={() => navigate('/dashboard')}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="primary" 
                                size="full"
                            >
                                Update
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;
