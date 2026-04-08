import { motion } from 'framer-motion';
import Typography from '../shared/typography';

const Goal = ({ goal, setGoal, saving }) => {
  
  // Array of goal options to display to the user
  const goals = [
    {
      value: "CREATOR",
      title: "I'm a Creator",
      description: "Grow my audience and monetize my content"
    },
    {
      value: "BUSINESS",
      title: "I'm a Business",
      description: "Promote my products and services"
    },
    {
      value: "PERSONAL",
      title: "Personal Use",
      description: "Share my links with friends and community"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        {/* header */}
        <Typography variant="p" className="text-gray-600">
          This helps us personalize your weblinqo experience
        </Typography>
      </div>

      {/* goal buttons */}
      <div className="space-y-3">
        {goals.map((item) => (
          <motion.button
            key={item.value}
            whileTap={{ scale: 0.98 }}
            onClick={() => !saving && setGoal(item.value)}
            disabled={saving}
            className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
              goal === item.value
                ? "border-primary bg-[#f8faf3]"
                : "border-gray-200 hover:border-primary/50 hover:bg-[#f8faf3]/50"
            } ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
            type="button"
          >
            {/* Goal Title & Goal Description */}
            <Typography variant="h4" className="font-semibold text-gray-900">{item.title}</Typography>
            <Typography variant="p" className="text-sm text-gray-600 mt-1">
              {item.description}
            </Typography>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Goal;
