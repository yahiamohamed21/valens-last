"use client";

import React from "react";

export default function OtpVerificationAnimation() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a] p-4 font-sans">

      {/* Main Card */}
      <div
        className="relative flex flex-col items-center rounded-2xl border border-white/5 bg-[#141414] shadow-2xl"
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "40px 24px"
        }}
      >

        {/* Logo Section */}
        <div className="flex flex-col items-center text-center">
          <h1
            className="text-2xl font-black tracking-widest text-[#E35A50]"
            style={{ textShadow: "0 0 15px rgba(227,90,80,0.4)" }}
          >
            VALENS
          </h1>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8e8e93]">
            Elite Performance Club
          </p>
        </div>

        {/* Top Tabs */}
        <div className="mt-8 flex w-full rounded-[14px] bg-[#1a1514] p-1.5">
          <button className="flex-1 rounded-[10px] py-2.5 text-[12px] font-bold tracking-widest text-[#8e8e93] transition-colors hover:text-white">
            LOG IN
          </button>
          <button className="flex-1 rounded-[10px] py-2.5 text-[12px] font-bold tracking-widest text-[#8e8e93] transition-colors hover:text-white">
            SIGN UP
          </button>
        </div>

        {/* Instructional Text */}
        <p className="mt-8 text-center text-[10px] font-bold leading-relaxed tracking-wider text-[#8e8e93] uppercase">
          Enter the 6-digit OTP sent to your email and your new password.
        </p>

        {/* Form */}
        <form className="mt-8 flex w-full flex-col gap-6" onSubmit={(e) => e.preventDefault()}>

          {/* OTP Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[#a1a1aa]">
              OTP Verification Code
            </label>
            <input
              type="text"
              placeholder="e.g. 123456"
              className="w-full rounded-[12px] border border-white/5 bg-[#1a1514] px-4 py-3.5 text-[13px] font-medium text-white placeholder-[#52525b] focus:border-[#E35A50] focus:outline-none transition-colors text-center tracking-widest"
              maxLength={6}
            />
          </div>

          {/* New Password Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[#a1a1aa]">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter New Password"
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
              placeholder="Verify New Password"
              className="w-full rounded-[12px] border border-white/5 bg-[#1a1514] px-4 py-3.5 text-[13px] font-medium text-white placeholder-[#52525b] focus:border-[#E35A50] focus:outline-none transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full rounded-[14px] bg-[#E35A50] py-4 text-[12px] font-black tracking-widest text-[#111111] transition-transform hover:scale-[1.02] active:scale-100"
          >
            RESET CREDENTIALS
          </button>
        </form>

        {/* Footer Link */}
        <button className="mt-8 text-[11px] font-black uppercase tracking-widest text-[#8e8e93] transition-colors hover:text-white">
          Cancel & Back to Log in
        </button>

      </div>
    </div>
  );
}
