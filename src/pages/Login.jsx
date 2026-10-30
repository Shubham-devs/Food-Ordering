import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Delete } from "lucide-react";
import { registerUser } from "../api/auth";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function pressKey(key) {
    setError("");

    if (key === "delete") {
      setMobile((value) => value.slice(0, -1));
      return;
    }

    setMobile((value) => (value.length < 10 ? value + key : value));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!/^[0-9]{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        phone: mobile,
        dial_code: "+91",
      });

      if (response?.status === "Success" && response?.data === "otp sent") {
        sessionStorage.setItem("food_order_mobile", mobile);
        navigate("/verify-otp", {
          state: { mobile: mobile },
        });
      } else {
        setError(data?.message || "Unexpected response. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

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
        aria-label="Go back"
        onClick={() => navigate(-1)}
        className="flex h-[34px] w-[35px] items-center justify-center bg-transparent text-[#ff5b19] mt-4 ml-3"
      >
        <ArrowLeft size={24} strokeWidth={1.8} />
      </button>
      {/* Signup content */}
      <section className="px-[14px]">
        <h1 className="mb-2  text-[24px] leading-[32px] font-bold tracking-[0%] text-[#292E39]">
          Sign Up to Fastor
        </h1>

        <p className="mb-[34px] max-w-[310px] text-[14px] leading-[150%] font-normal tracking-[0] text-[#696969]">
          Let us know your mobile number and we will send you an OTP for
          verification.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex h-[48px] w-full items-center align-center rounded-[8px] border border-[#d1d1d1] bg-[#f5f5f5]  px-[20px] focus-within:border-[#ff5b19]">
            <span className="shrink-0 pr-3 text-[16px] leading-normal font-bold tracking-[0px] text-[#292E39]">
              +91
            </span>
            <span className="shrink-0 pr-8 text-[16px] leading-normal font-medium tracking-[0px] text-[#FB7632]">
              |
            </span>
            <span className="shrink-0 pr-2 text-[16px] leading-normal font-medium tracking-[0px] text-[#a2a6b4]">
              -
            </span>

            <input
              type="tel"
              inputMode="none"
              readOnly
              autoComplete="off"
              aria-label="Mobile number"
              placeholder="00000"
              value={mobile}
              onChange={(event) =>
                setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))
              }
              maxLength={10}
              className="h-full min-w-0 flex-1 bg-transparent text-[16px] leading-normal font-medium tracking-[0px] outline-none placehodler:text-[#a2a6b4]"
            />
          </div>

          {error && <p className="mt-2 text-[11px] text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="fixed bottom-[252px] left-1/2 z-20 h-[48px] w-[calc(100%-28px)] max-w-[402px] -translate-x-1/2 rounded-[8px] bg-[#ff5900] text-[16px] leading-[100%] font-semibold tracking-[1.25px] text-center text-white"
          >
            {loading ? "Sending..." : "Get OTP"}
          </button>
        </form>
      </section>
      {/* Terms */}
      <p className="fixed right-2 bottom-[232px] left-2 z-20 m-0 text-center text-[10px] leading-[150%] font-normal tracking-[0%]">
        By clicking, I accept the{" "}
        <strong className="text-[10px] leading-[150%] font-medium tracking-[0%]">
          Terms &amp; Conditions
        </strong>{" "}
        and{" "}
        <strong className="text-[10px] leading-[150%] font-medium tracking-[0%]">
          Privacy Policy
        </strong>
      </p>

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
