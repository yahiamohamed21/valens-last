"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/SvgIcons";
import { api, decodeJwt } from "@/lib/api";

export default function LoginPage() {
  const { showToast, loginUser, sendRegistrationOtp, verifyRegistrationOtp } = useApp();
  const router = useRouter();

  // Active view: "login" | "signup" | "forgot" | "otp" | "confirm-email"
  const [activeTab, setActiveTab] = useState<"login" | "signup" | "forgot" | "otp" | "confirm-email">("login");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  // OTP Reset Fields
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPasswordReset, setConfirmPasswordReset] = useState("");
  const [otpStep, setOtpStep] = useState<1 | 2 | "success">(1); // 1 = Enter OTP boxes, "success" = verified, 2 = Enter Passwords

  // Confirm Email Fields
  const [confirmEmailCode, setConfirmEmailCode] = useState("");
  const [confirmEmailStep, setConfirmEmailStep] = useState<1 | "success">(1);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const success = await loginUser(email, password);
    if (success) {
      // Reset fields
      setEmail("");
      setPassword("");

      const storedToken = typeof window !== "undefined" ? localStorage.getItem("valens_jwt_token") : null;
      let role = "Customer";
      if (storedToken) {
        try {
          const claims = decodeJwt(storedToken);
          if (claims) {
            role = (claims.role || claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "Customer") as string;
          }
        } catch (error) {
          console.error("Error decoding token for login routing:", error);
        }
      }

      if (role.toLowerCase() === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !firstName || !lastName || !phone || !address || !city) {
      showToast("All fields are required.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    const success = await sendRegistrationOtp({
      email,
      password,
      fullName: `${firstName} ${lastName}`,
      phone,
      address,
      city,
    });
    if (success) {
      // Don't reset fields immediately because we might want to show the email in the OTP screen
      setActiveTab("confirm-email");
      setConfirmEmailStep(1);
      setConfirmEmailCode("");
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await api.auth.forgotPassword({ email });
      showToast(`Password recovery OTP code dispatched to ${email}`, "info");
      setActiveTab("otp");
      setOtpStep(1); // Reset to first step
      setOtpCode(""); // Clear previous OTP
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message || "Failed to send recovery code", "error");
      } else {
        showToast("Failed to send recovery code", "error");
      }
    }
  };

  const handleOtpResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || !newPassword || !confirmPasswordReset) {
      showToast("All fields are required.", "error");
      return;
    }

    if (newPassword !== confirmPasswordReset) {
      showToast("Passwords do not match.", "error");
      return;
    }

    try {
      await api.auth.resetPasswordOtp({
        otpCode,
        newPassword,
        confirmPassword: confirmPasswordReset,
      });
      showToast("Password has been reset successfully. Please log in.", "success");
      setOtpCode("");
      setNewPassword("");
      setConfirmPasswordReset("");
      setEmail("");
      setOtpStep(1);
      setActiveTab("login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message || "Failed to reset password", "error");
      } else {
        showToast("Failed to reset password", "error");
      }
      // If API fails (e.g. wrong OTP), go back to step 1 so they can fix the OTP
      setOtpStep(1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-main-bg text-foreground">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">

        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-coral/5 blur-[120px] pointer-events-none" />

        {/* Auth Panel Box */}
        <div className="w-full max-w-md rounded-3xl border border-border-color bg-card-bg p-8 shadow-2xl glass-panel relative overflow-hidden">

          {/* logo accent glow */}
          <div className="absolute top-0 left-1/2 h-1 w-20 -translate-x-1/2 bg-primary-coral rounded-full blur-[1px]" />

          <div className="text-center mb-8">
            <span className="text-glow text-xl font-black tracking-widest text-primary-coral">VALENS</span>
            <span className="block text-4xs text-muted-text mt-1 uppercase tracking-widest font-bold">Elite Performance Club</span>
          </div>

          {/* Login tab header switcher */}
          {(activeTab === "login" || activeTab === "signup") && (
            <div className="grid grid-cols-2 rounded-xl bg-surface-deep p-1 mb-6 border border-border-color/30">
              <button
                onClick={() => setActiveTab("login")}
                className={`rounded-lg py-2.5 text-2xs font-extrabold uppercase tracking-wider transition-luxury ${activeTab === "login"
                  ? "bg-card-bg text-white shadow-lg border border-border-color/30"
                  : "text-muted-text hover:text-gray-800"
                  }`}
              >
                Log In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`rounded-lg py-2.5 text-2xs font-extrabold uppercase tracking-wider transition-luxury ${activeTab === "signup"
                  ? "bg-card-bg text-white shadow-lg border border-border-color/30"
                  : "text-muted-text hover:text-gray-800"
                  }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Form Content */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text">Password</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab("forgot")}
                    className="text-4xs font-bold text-primary-coral hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                />
              </div>

              <div className="flex items-center gap-3 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  id="remember_me"
                  className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 cursor-pointer h-4 w-4"
                />
                <label htmlFor="remember_me" className="text-3xs font-semibold text-white hover:text-gray-800 cursor-pointer uppercase tracking-wider">
                  Remember my session details
                </label>
              </div>

              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-[#180f0d] hover:bg-white hover:text-[#180f0d] transition-all duration-300 shadow-lg shadow-primary-coral/10 hover:scale-[1.01] cursor-pointer"
              >
                AUTHENTICATE
                <Icon name="lock" size={14} />
              </button>
            </form>
          )}

          {activeTab === "signup" && (
            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                  />
                </div>
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                  />
                </div>
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Create Secure Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Verify Secure Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+201000000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Address</label>
                  <input
                    type="text"
                    required
                    placeholder="12 El-Galaa St"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                  />
                </div>
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Cairo"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  id="terms_agree"
                  className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 cursor-pointer h-4 w-4"
                />
                <label htmlFor="terms_agree" className="text-3xs font-semibold text-white hover:text-gray-800 cursor-pointer uppercase tracking-wider">
                  I agree to the terms of athlete membership *
                </label>
              </div>

              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-[#180f0d] hover:bg-white hover:text-[#180f0d] transition-all duration-300 shadow-lg shadow-primary-coral/10 hover:scale-[1.01] cursor-pointer"
              >
                CREATE ELITE STACK
                <Icon name="check" size={14} />
              </button>
            </form>
          )}

          {activeTab === "forgot" && (
            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
              <p className="text-xs text-muted-text leading-relaxed text-center mb-2 uppercase font-bold tracking-wide">
                Provide your registered email address. We will dispatch a secure link to reset your credentials.
              </p>
              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                />
              </div>

              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-[#180f0d] hover:bg-white hover:text-[#180f0d] transition-all duration-300 hover:scale-[1.01] cursor-pointer"
              >
                SEND RECOVERY LINK
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className="text-3xs font-black uppercase tracking-wider text-muted-text hover:text-gray-800 text-center mt-3"
              >
                Back to Authentication
              </button>
            </form>
          )}

          {activeTab === "otp" && (
            <div className="w-full animate-fade-in">
              {otpStep === 1 || otpStep === 'success' ? (
                <div className="flex flex-col items-center py-4">
                  <h2 className={`text-[20px] font-bold text-white tracking-wide transition-opacity duration-500`}>
                    {otpStep === 'success' ? "Verified successfully" : "Let's verify your email"}
                  </h2>
                  <div className="mt-3 flex flex-col items-center text-[12px] leading-relaxed transition-colors duration-500">
                    <span className={otpStep === 'success' ? "text-[#22c55e]" : "text-[#8e8e93]"}>
                      {otpStep === 'success' ? "Your email has been verified." : "We've sent a 6-digit code to your email."}
                    </span>
                    <span className={`text-[#8e8e93] transition-opacity duration-300 ${otpStep === 'success' ? 'opacity-0 h-0' : 'opacity-100'}`}>
                      It'll auto-verify once entered.
                    </span>
                  </div>

                  <div className="relative mt-10 flex h-[50px] w-full items-center justify-center gap-3">
                    {[...Array(6)].map((_, i) => {
                      const digit = otpCode[i] || "";
                      const isActive = otpStep === 1 && (otpCode.length === i || (otpCode.length === 6 && i === 5));
                      const isSuccess = otpStep === 'success';

                      // Calculate translation to center. Gap is 12px (0.75rem), width is 45px. Total step is 57px.
                      const offsets = [142.5, 85.5, 28.5, -28.5, -85.5, -142.5];

                      return (
                        <div
                          key={i}
                          className={`absolute flex h-[50px] w-[45px] items-center justify-center rounded-[12px] overflow-hidden transition-all duration-700 ease-in-out ${isSuccess
                            ? 'border-2 border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                            : !isActive
                              ? 'border border-[#333336]'
                              : 'shadow-[0_0_12px_rgba(255,69,58,0.3)]'
                            }`}
                          style={{
                            // Start at normal position, translate to center on success
                            transform: `translateX(${isSuccess ? 0 : offsets[i] * -1}px)`,
                            opacity: isSuccess && i !== 2 ? 0 : 1, // Only box 2 remains visible as the final box
                            zIndex: i === 2 ? 50 : 10
                          }}
                        >
                          {/* Rotating glow animation element - ONLY FOR ACTIVE */}
                          {isActive && !isSuccess && (
                            <div className="absolute inset-[-100%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#ff453a_50%,transparent_100%)]"></div>
                          )}

                          {/* Inner dark box masking the center */}
                          <div className={`absolute inset-[1.5px] rounded-[10px] bg-[#1a1a1c] z-10 flex items-center justify-center transition-all duration-500 ${!isActive || isSuccess ? 'inset-0 rounded-[12px]' : ''
                            }`}>
                            {!isSuccess && digit && <span className="animate-pop text-[22px] font-semibold text-white">{digit}</span>}
                            {isActive && !digit && !isSuccess && (
                              <div className="h-6 w-[2px] bg-white opacity-70 animate-pulse"></div>
                            )}
                            {/* Checkmark for success */}
                            {isSuccess && i === 2 && (
                              <div className="animate-pop text-[#22c55e] transition-all duration-500 delay-300">
                                <Icon name="check" size={24} />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Hidden actual input for accessibility and mobile keyboard */}
                    {otpStep === 1 && (
                      <input
                        type="text"
                        maxLength={6}
                        autoFocus
                        className="absolute inset-0 z-20 w-full h-full opacity-0 cursor-text"
                        value={otpCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setOtpCode(val);
                          if (val.length === 6) {
                            setOtpStep('success');
                            // Wait for animation, then go to step 2
                            setTimeout(() => setOtpStep(2), 2000);
                          }
                        }}
                      />
                    )}
                  </div>

                  <div className={`mt-12 flex w-full justify-center text-[12px] font-medium transition-opacity duration-500 ${otpStep === 'success' ? 'opacity-0' : 'opacity-100'}`}>
                    <span className="text-[#8e8e93]">Didn't receive the code?</span>
                    <button
                      type="button"
                      className="ml-1.5 font-bold text-white transition-opacity hover:opacity-80"
                      onClick={handleForgotSubmit}
                    >
                      Resend
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleOtpResetSubmit} className="flex flex-col gap-6 animate-fade-in w-full">
                  <div className="flex flex-col items-center text-center mb-2">
                    <h2 className="text-[20px] font-bold text-white tracking-wide">
                      Create new password
                    </h2>
                    <p className="mt-2 text-[12px] text-[#8e8e93]">
                      Your new password must be different from previous used passwords.
                    </p>
                  </div>

                  {/* New Password Field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a1a1aa]">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Enter New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-[12px] border border-white/5 bg-[#1a1514] px-4 py-3.5 text-[13px] font-medium text-white placeholder-[#52525b] focus:border-[#E35A50] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#a1a1aa]">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Verify New Password"
                      value={confirmPasswordReset}
                      onChange={(e) => setConfirmPasswordReset(e.target.value)}
                      className="w-full rounded-[12px] border border-white/5 bg-[#1a1514] px-4 py-3.5 text-[13px] font-medium text-white placeholder-[#52525b] focus:border-[#E35A50] focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-[14px] bg-[#E35A50] py-4 text-[12px] font-black tracking-widest text-[#111111] transition-transform hover:scale-[1.02] active:scale-100"
                  >
                    RESET CREDENTIALS
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep(1); // Go back to OTP if they want
                    }}
                    className="mt-2 text-[11px] font-black uppercase tracking-widest text-[#8e8e93] transition-colors hover:text-white text-center"
                  >
                    Back to Edit OTP
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === "confirm-email" && (
            <div className="w-full animate-fade-in">
              <div className="flex flex-col items-center py-4">
                <h2 className={`text-[20px] font-bold text-white tracking-wide transition-opacity duration-500`}>
                  {confirmEmailStep === 'success' ? "Email verified" : "Let's verify your email"}
                </h2>
                <div className="mt-3 flex flex-col items-center text-[12px] leading-relaxed transition-colors duration-500">
                  <span className={confirmEmailStep === 'success' ? "text-[#22c55e]" : "text-[#8e8e93]"}>
                    {confirmEmailStep === 'success' ? "Account created successfully!" : `We've sent a 6-digit code to ${email || "your email"}.`}
                  </span>
                  <span className={`text-[#8e8e93] transition-opacity duration-300 ${confirmEmailStep === 'success' ? 'opacity-0 h-0' : 'opacity-100'}`}>
                    It'll auto-verify once entered.
                  </span>
                </div>

                <div className="relative mt-10 flex h-[50px] w-full items-center justify-center gap-3">
                  {[...Array(6)].map((_, i) => {
                    const digit = confirmEmailCode[i] || "";
                    const isActive = confirmEmailStep === 1 && (confirmEmailCode.length === i || (confirmEmailCode.length === 6 && i === 5));
                    const isSuccess = confirmEmailStep === 'success';

                    const offsets = [142.5, 85.5, 28.5, -28.5, -85.5, -142.5];

                    return (
                      <div
                        key={i}
                        className={`absolute flex h-[50px] w-[45px] items-center justify-center rounded-[12px] overflow-hidden transition-all duration-700 ease-in-out ${isSuccess
                          ? 'border-2 border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                          : !isActive
                            ? 'border border-[#333336]'
                            : 'shadow-[0_0_12px_rgba(255,69,58,0.3)]'
                          }`}
                        style={{
                          transform: `translateX(${isSuccess ? 0 : offsets[i] * -1}px)`,
                          opacity: isSuccess && i !== 2 ? 0 : 1,
                          zIndex: i === 2 ? 50 : 10
                        }}
                      >
                        {isActive && !isSuccess && (
                          <div className="absolute inset-[-100%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#ff453a_50%,transparent_100%)]"></div>
                        )}

                        <div className={`absolute inset-[1.5px] rounded-[10px] bg-[#1a1a1c] z-10 flex items-center justify-center transition-all duration-500 ${!isActive || isSuccess ? 'inset-0 rounded-[12px]' : ''
                          }`}>
                          {!isSuccess && digit && <span className="animate-pop text-[22px] font-semibold text-white">{digit}</span>}
                          {isActive && !digit && !isSuccess && (
                            <div className="h-6 w-[2px] bg-white opacity-70 animate-pulse"></div>
                          )}
                          {isSuccess && i === 2 && (
                            <div className="animate-pop text-[#22c55e] transition-all duration-500 delay-300">
                              <Icon name="check" size={24} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {confirmEmailStep === 1 && (
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      className="absolute inset-0 z-20 w-full h-full opacity-0 cursor-text"
                      value={confirmEmailCode}
                      onChange={async (e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setConfirmEmailCode(val);
                        if (val.length === 6) {
                          const success = await verifyRegistrationOtp(email, val);
                          if (success) {
                            setConfirmEmailStep('success');
                            setTimeout(() => {
                              setEmail("");
                              setPassword("");
                              setConfirmPassword("");
                              setFirstName("");
                              setLastName("");
                              setPhone("");
                              setAddress("");
                              setCity("");
                              setConfirmEmailCode("");
                              setConfirmEmailStep(1);
                              router.push("/dashboard");
                            }, 2000);
                          } else {
                            setConfirmEmailCode("");
                          }
                        }
                      }}
                    />
                  )}
                </div>

                <div className={`mt-12 flex w-full justify-center text-[12px] font-medium transition-opacity duration-500 ${confirmEmailStep === 'success' ? 'opacity-0' : 'opacity-100'}`}>
                  <span className="text-[#8e8e93]">Didn't receive the code?</span>
                  <button
                    type="button"
                    className="ml-1.5 font-bold text-white transition-opacity hover:opacity-80"
                    onClick={() => {
                      showToast(`Verification code resent to ${email}`, "info");
                    }}
                  >
                    Resend
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
