import React from "react";
import Button from "../../shared/button";
import Input from "../../shared/input";
import Typography from "../../shared/typography";
import { AiOutlineArrowLeft } from "react-icons/ai";

const OtpForm = ({
  otp,
  setOtp,
  isLoading,
  handleOtpSubmit,
  handleResendOtp,
  resendDisabled,
  resendTimer,
  onBack,
  backButtonText = "Back to sign up"
}) => (
  <div className="space-y-5">
    {/* OTP Verification Form */}
    <form onSubmit={handleOtpSubmit} className="space-y-4">
      <Input
        id="otp"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="• • • • • •"
        className="text-center tracking-[0.5em] text-lg"
        value={otp}
        onChange={(e) => {
          // Allow only digits and limit OTP to 6 characters
          const value = e.target.value.replace(/\D/g, "");
          setOtp(value.slice(0, 6));
        }}
        required
        maxLength={6}
        disabled={isLoading}
        aria-label="Verification code"
      />

      {/* Submit Button */}    
      <Button
        type="submit"
        size="full"
        isLoading={isLoading}
        disabled={isLoading}
        className={!isLoading ? "hover:scale-[1.02] active:scale-95" : ""}
      >
        {isLoading ? "Verifying..." : "Verify & Continue"}
      </Button>
    </form>

    {/* Resend OTP Section */}
    <div className="text-center">
      <Typography variant="span" className="text-sm text-gray-500">
        Didn't receive a code?{" "}
        <button
          onClick={handleResendOtp}
          disabled={resendDisabled || isLoading}
          className={`font-medium ${
            resendDisabled || isLoading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-black hover:underline'
          }`}
        >
          {resendDisabled ? `Resend in ${resendTimer}s` : "Resend code"}
        </button>
      </Typography>
    </div>

    {/* according to form settings back navigation button  */}
    <Button 
      variant="ghost"
      onClick={onBack} 
      className="flex items-center justify-center w-full text-gray-500 hover:text-gray-700 mt-4 text-sm font-medium"
      leftIcon={<AiOutlineArrowLeft />}
    >
      {backButtonText}
    </Button>
  </div>
);

export default OtpForm;
