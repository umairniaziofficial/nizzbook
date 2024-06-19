import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../configs/firebaseConfig.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import SideImage from "./SideImage.jsx";

const getFriendlyErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already in use. Please use a different email or log in.";
    case "auth/invalid-email":
      return "The email address is not valid. Please check and try again.";
    case "auth/weak-password":
      return "The password is too weak. Please choose a stronger password.";
    case "auth/operation-not-allowed":
      return "Signup is not allowed at the moment. Please contact support.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "An error occurred. Please try again.";
  }
};

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setLoading(false);
      setIsSuccess(true);
      setMessage("Account created successfully! Redirecting to home...");

      setEmail("");
      setPassword("");
      setName("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error("Error signing up:", error);
      const userFriendlyMessage = getFriendlyErrorMessage(error.code);
      setIsSuccess(false);
      setMessage(userFriendlyMessage);
    }
  };

  return (
    <div className="flex w-screen min-h-screen mx-auto bg-[#040605]">
     <div className="flex flex-col md:w-1/2 px-2 w-full md:pl-40 md:items-start items-center justify-center text-white bg-[#040605]">
        <h1 className="text-4xl font-bold mb-4 text-gray-300">Sign Up Form</h1>
        <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-3/4">
          <input
            type="text"
            placeholder="Enter your name"
            className="p-2 rounded w-full py-4 pl-4 bg-gray-700 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 rounded w-full py-4 pl-4 bg-gray-700 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="p-2 rounded w-full py-4 pl-4 bg-gray-700 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="p-2 bg-orange-500 rounded hover:bg-orange-800 flex items-center justify-center"
          >
            {loading ? (
              <div className="text-center p-2">
                <div className="w-4 h-4 border-4 border-dashed rounded-full animate-spin border-white mx-auto"></div>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 ${isSuccess ? "text-green-500" : "text-red-500"}`}
          >
            {message}
          </p>
        )}
        <div className="mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/" className="text-orange-500 font-bold hover:underline">
            Login
          </Link>
        </div>
      </div>
      <SideImage/>
    </div>
  );
}
