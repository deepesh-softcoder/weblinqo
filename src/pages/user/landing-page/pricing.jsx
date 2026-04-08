import React, { useEffect, useState } from 'react';
import SectionTitle from './section-title';
import api from '../../../services/api';
import { Link } from 'react-router-dom';
import useUserStore from '../../../stores/userStore';
import useLoaderStore from '../../../stores/loaderStore';

const PricingPlans = () => {
    const [plans, setPlans] = useState([]);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useUserStore();
    const { showLoader, hideLoader } = useLoaderStore();

    // fetching pricing plans
    useEffect(() => {
        const fetchPlans = async () => {
            showLoader();
            try {
                const response = await api.get('/api/v1/subscription/plans');
                setPlans(response.data.data);
            } catch (err) {
                console.error('Error fetching pricing plans:', err);
                setError('Unable to fetch plans');
            } finally {
                hideLoader();
            }
        };

        fetchPlans();
    }, []);

    return (
        <div className="mb-[72px] px-4 flex justify-center flex-col items-center bg-offWhite">
            <SectionTitle title={'Pricing Plan'} style={'mb-[20px] mt-[4.5rem]'} />
            <SectionTitle title={'Plans that work best for you'} style={'mt-[0px] mb-10'} />

            {/* pricing plan cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl w-full">
                {error ? (
                    <p className="text-red-500 text-center w-full py-10 font-semibold text-lg">
                        {error}
                    </p>
                ) : (plans.sort((a, b) => a.price - b.price).map((plan) => (
                    <div
                        key={plan.id}
                        className="bg-white border border-blue-300 rounded-2xl shadow-md overflow-hidden flex flex-col items-center"
                    >
                        <h2 className="text-size-32 font-semibold text-center mt-6 tracking-wider">{plan.name}</h2>

                        <div className="mt-4 w-[85%] tracking-wider text-white text-size-16 font-medium bg-gradient-to-r from-blue-600 to-purple-400 py-3 rounded-full text-center">
                            {plan.price > 0 ? `Choose ${plan.name} $${plan.price}/month` : 'A great solution for beginners'}
                        </div>

                        {/* feature list */}
                        <div className='flex justify-center flex-1'>
                            <ul className="mt-6 space-y-5 px-8 text-gray-800 mb-8">
                                {Object.entries(plan.features).map(([key, value]) => (
                                    value && (<li key={key} className="flex items-center gap-2">
                                        <span className="text-green-600 text-md">✓</span>
                                        <span className='text-size-16'>{key.replace(/([A-Z])/g, ' $1')}</span>
                                    </li>)
                                ))}
                            </ul>
                        </div>

                        {/* navigating button as per the authentication */}
                        <Link
                            to={isAuthenticated ? '/dashboard' : '/signup'}>
                            <button className="mb-6 mt-auto bg-gradient-to-r from-blue-600 to-purple-400 text-white px-5 py-2 rounded-full text-sm font-semibold">
                                Get Started Plan
                            </button>
                        </Link>
                    </div>
                )))}
            </div>
        </div>
    );
};

export default PricingPlans;
