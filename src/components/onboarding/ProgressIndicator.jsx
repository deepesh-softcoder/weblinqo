// progress indicator for onboarding

export default function ProgressIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`w-8 h-2 rounded-full transition-all duration-300 ${
              index <= currentStep ? "bg-indigo-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}