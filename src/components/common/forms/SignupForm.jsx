import React from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Button from "../../shared/button";
import Input from "../../shared/input";
import Typography from "../../shared/typography";

// Sign up form
const SignupForm = ({
  formData,
  setFormData,
  showPassword,
  togglePassword,
  showConfirmPassword,
  toggleConfirmPassword,
  isLoading,
  isNavigating,
  handleSignup
}) => {
  const isPasswordMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;
  const isSubmitDisabled = isLoading || isNavigating || isPasswordMismatch;

  return (
    <form className="space-y-4" onSubmit={handleSignup}>
      {/* Email Input */}
      <Input
        id="email"
        type="email"
        label="Email"
        name="email"
        placeholder="your@email.com"
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
        required
      />

      {/* Password and Confirm Password Fields */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="••••••••"
          className={showPassword ? "font-pier" : "font-sans"}
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          required
          rightIcon={
            <button
              type="button"
              onClick={togglePassword}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </button>
          }
        />

        <Input
          id="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="••••••••"
          className={showConfirmPassword ? "font-pier" : "font-sans"}
          value={formData.confirmPassword}
          onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
          error={isPasswordMismatch ? "Passwords do not match" : null}
          rightIcon={
            <button
              type="button"
              onClick={toggleConfirmPassword}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </button>
          }
        />
      </div>

      {/* Submit button which is disabled if something is loading, navigating or passwords unmatched */}
      <Button
        type="submit"
        size="full"
        isLoading={isLoading}
        disabled={isSubmitDisabled}
        variant={isSubmitDisabled ? "disabled" : "primary"}
        className={!isSubmitDisabled ? "hover:bg-white border-primary border-2 hover:text-primary" : ""}
      >
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
};

export default SignupForm;
