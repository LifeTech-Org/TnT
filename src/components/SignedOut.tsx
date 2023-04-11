import { useState } from "react";
import { signIn } from "../utils/firebase";

const SignedOut = () => {
  const [status, setStatus] = useState("pending");
  const handleClickSignIn = () => {
    signIn().catch(() => {
      setStatus("error");
      setTimeout(() => setStatus("pending"), 3000);
    });
  };
  return (
    <div className="h-full w-full relative">
      <button
        className={
          (status === "pending" ? "border-gray-400 " : "border-red-800 ") +
          "absolute bottom-0 w-full h-10 flex items-center border justify-center gap-4 rounded-sm hover:bg-zinc-800"
        }
        onClick={handleClickSignIn}
      >
        <img
          src="https://img.icons8.com/color/144/null/google-logo.png"
          alt="google"
          className="h-6 w-6"
        />
        <span className="text-gray-300 text-xs font-semibold">
          {status === "pending"
            ? "Sign in with Google"
            : "Something went wrong"}
        </span>
      </button>
    </div>
  );
};

export default SignedOut;
