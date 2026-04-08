import { Link } from 'react-router-dom';
import Typography from '../components/shared/typography';
import Button from '../components/shared/button';

// not found page for non and mismatch routes
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-offWhite">
      <div className="text-center max-w-md px-4">
        <Typography variant="h1" className="text-9xl font-black text-gray-900 mb-2">404</Typography>
        <Typography variant="h2" className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</Typography>
        <Typography variant="p" className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Link to="/">
          <Button
            variant="primary"
            className="px-8 py-3 text-lg rounded-full hover:scale-[1.03] active:scale-95"
          >
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
