import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Delete, Phone } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/auth";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [seconds, setSeconds] = useState(30);
  const inputRefs = useRef([]);

  const location = useLocation();
  const navigate = useNavigate();

  const mobileNumber = location.state?.mobile || "";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleChange = (value, index) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const digits = event.clipboardresponse
      .getresponse("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");

    const updated = Array(6).fill("");
    digits.forEach((digit, index) => {
      updated[index] = digit;
    });

    setOtp(updated);
    inputRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const handleContinue = async (event) => {
    event.preventDefault();
    setError("");

    if (!mobileNumber) {
      setError("Mobile number is missing. Please login again.");
      return;
    }

    if (otp.some((digit) => !digit)) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({
        phone: mobileNumber,
        dial_code: "+91",
        otp: otp.join(""),
      });

      if (response.status >= 400 || response.status === "Failed") {
        throw new Error(response.message || "Invalid OTP. Please try again.");
      }

      // Save JWT token
      const token = response?.data.token;

      if (!token) {
        throw new Error("Authentication token not received.");
      }

      localStorage.setItem("token", token);
      // Save logged-in user details
      const user = response?.data;

      if (user?.user_name) {
        localStorage.setItem("userName", user?.user_name);
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.response?.message ||
          err.message ||
          "OTP verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (seconds > 0 || resending || !mobileNumber) return;

    setError("");
    setResending(true);

    try {
      const response = await registerUser({
        phone: mobileNumber,
        dial_code: "+91",
      });

      if (response?.status !== "Success" && response?.response !== "otp sent") {
        throw new Error(response.message || "Failed to resend OTP.");
      }

      setOtp(Array(6).fill(""));
      setSeconds(30);

      setActiveIndex(0);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Unable to resend OTP. Try again.");
    } finally {
      setResending(false);
    }
  };

  const [activeIndex, setActiveIndex] = useState(0);

  const pressKey = (key) => {
    // Find the currently focused OTP box.
    const focusedIndex = inputRefs.current.findIndex(
      (input) => input === document.activeElement,
    );

    const index = focusedIndex >= 0 ? focusedIndex : activeIndex;

    if (key === "delete") {
      const updated = [...otp];

      if (updated[index]) {
        updated[index] = "";
        setOtp(updated);
      } else if (index > 0) {
        updated[index - 1] = "";
        setOtp(updated);
        setActiveIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      }

      return;
    }

    if (!/^\d$/.test(key)) return;

    const updated = [...otp];
    updated[index] = key;
    setOtp(updated);

    if (index < 5) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    } else {
      setActiveIndex(5);
      inputRefs.current[5]?.focus();
    }
  };

  const keys = [
    { number: "1", letters: "" },
    { number: "2", letters: "ABC" },
    { number: "3", letters: "DEF" },
    { number: "4", letters: "GHI" },
    { number: "5", letters: "JKL" },
    { number: "6", letters: "MNO" },
    { number: "7", letters: "PQRS" },
    { number: "8", letters: "TUV" },
    { number: "9", letters: "WXYZ" },
  ];

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-hidden  bg-white text-[#303442]">
      {/* Back button */}
      <button
        type="button"
        onClick={() => window.history.back()}
        aria-label="Go back"
        className="flex h-[34px] w-[35px] items-center justify-center bg-transparent text-[#ff5b19] mt-4 ml-3"
      >
        <ArrowLeft size={24} strokeWidth={1.8} />
      </button>
      <section className="px-[14px]">
        <h1 className="mb-2  text-[24px] leading-[32px] font-bold tracking-[0%] text-[#292E39]">
          6-digit code
        </h1>

        <p className="mb-2 max-w-[310px] text-[14px] leading-[150%] font-normal tracking-[0] text-[#696969]">
          Please enter the code we've sent to
        </p>

        <p className="mb-[30px] max-w-[310px] text-[14px] leading-[150%] font-bold tracking-[0] text-[#292E39]">
          +91 {mobileNumber || "-"}
        </p>

        <form onSubmit={handleContinue}>
          <div className="flex items-center gap-[6px]">
            {otp.map((digit, index) => (
              <div key={index} className="flex items-center gap-[6px]">
                {index === 3 && (
                  <span className="text-[10px] text-[#777980] mx-[8px]">-</span>
                )}

                <input
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  aria-label={`OTP digit ${index + 1}`}
                  type="text"
                  inputMode="none"
                  readOnly
                  autoComplete="off"
                  maxLength={1}
                  value={digit}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={`h-[40px] w-[40px] shrink-0 rounded-[3px] border bg-white p-0 text-center text-[14px] outline-none ${
                    activeIndex === index
                      ? "border-[#ff5108]"
                      : "border-[#d7d7d7]"
                  }`}
                />
              </div>
            ))}
          </div>
          {error && (
            <p
              role="alert"
              aria-live="polite"
              className="mt-2 text-[12px] leading-4 text-red-600"
            >
              {error}
            </p>
          )}

          <div className="text-[14px] font-medium  tracking-[-2%] mt-2 align-bottom">
            <span className="text-[#303440]">I didn't receive a code </span>
            {seconds > 0 ? (
              <span className="text-[14px] font-bold leading-[15px] tracking-[-2%]  text-[#ff5108]">
                (00:{String(seconds).padStart(2, "0")})
              </span>
            ) : (
              <button
                type="button"
                onClick={resendOtp}
                className="text-[14px] font-bold leading-[15px] tracking-[-2%] text-[#ff5108]"
              >
                Resend code
              </button>
            )}
          </div>

          <button
            type="submit"
            className="fixed bottom-[252px] left-1/2 z-20 h-[48px] w-[calc(100%-28px)] max-w-[402px] -translate-x-1/2 rounded-[8px] bg-[#ff5900] text-[16px] leading-[100%] font-semibold tracking-[1.25px] text-center text-white"
          >
            {loading ? "Verifying..." : "Continue"}
          </button>
        </form>
      </section>

      {/* Custom numeric keypad */}
      <div className="absolute right-0 bottom-0 left-0 grid h-[216px] grid-cols-3 grid-rows-4 gap-[6px] border-t border-[#d1d3da] bg-[#dfe1e7] px-[6px] pt-[6px] pb-[6px]">
        {keys.map(({ number, letters }) => (
          <button
            key={number}
            type="button"
            onClick={() => pressKey(number)}
            className="flex h-[46px] min-w-0 flex-col items-center justify-center rounded-[5px] bg-white text-black"
          >
            <span className="text-[25px] leading-[100%] font-normal tracking-[-0.02em] text-center">
              {number}
            </span>

            <span className="text-[10px] leading-[100%] font-normal tracking-[0.17em] text-center">
              {letters}
            </span>
          </button>
        ))}

        <div />

        <button
          type="button"
          onClick={() => pressKey("0")}
          className="flex h-[46px] min-w-0 flex-col items-center justify-center rounded-[5px] bg-white text-black"
        >
          <span className=" text-[25px] leading-[100%] font-normal tracking-[-0.02em]">
            0
          </span>
        </button>

        <button
          type="button"
          aria-label="Delete last digit"
          onClick={() => pressKey("delete")}
          className="flex h-[46px] items-center justify-center rounded-[5px] text-black"
        >
          <Delete size={22} strokeWidth={1.7} />
        </button>
      </div>
    </main>
  );
}
