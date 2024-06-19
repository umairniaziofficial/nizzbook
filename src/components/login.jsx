import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../configs/firebaseConfig.js';
import { signInWithEmailAndPassword, signInWithRedirect, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import GoogleLogo from "../assets/GoogleLogo.svg";
import FacebookLogo from "../assets/FacebookLogo.svg";
import SideImage from './SideImage.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth(); 

  useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate('/home');
    } catch (error) {
      setLoading(false);
      setErrorMessage(getFriendlyErrorMessage(error.code));
    }
  };

  const getFriendlyErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Invalid email format. Please enter a valid email.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      default:
        return 'An error occurred. Please try again later.';
    }
  };

  const handleGoogleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Google login error: ", error);
      setErrorMessage(getFriendlyErrorMessage(error.code));
    }
  };

  const handleFacebookLogin = async () => {
    const facebookProvider = new FacebookAuthProvider();
    try {
      await signInWithRedirect(auth, facebookProvider);
    } catch (error) {
      console.error("Facebook login error: ", error);
      setErrorMessage(getFriendlyErrorMessage(error.code));
    }
  };

  return (
    <div className="flex w-screen min-h-screen mx-auto bg-[#040605]">
     <div className="flex flex-col md:w-1/2 px-2 w-full md:pl-40 md:items-start items-center justify-center text-white bg-[#040605]">
        <h1 className="text-4xl font-bold text-slate-300 py-5">Login Form</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-3/4">
          <input
            type="email"
            placeholder="Enter your email here"
            className="p-2 rounded w-full py-4 pl-4 bg-gray-700 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password here"
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
              'Login'
            )}
          </button>
        </form>
        {errorMessage && (
          <p className="mt-4 text-red-500">{errorMessage}</p>
        )}
        <div className="flex mt-4">
          <span className="text-gray-300 text-sm">Or Continue with</span>
        </div>
        <div className="flex gap-4 mt-4 w-3/4">
          <button className="bg-slate-700 drop-shadow-md h-auto py-2 w-full rounded hover:bg-slate-900" onClick={handleGoogleLogin}>
            <img src={GoogleLogo} alt="Google Logo" className="h-6 w-full" />
          </button>
          <button className="bg-slate-700 drop-shadow-md h-auto py-2 w-full rounded hover:bg-slate-900" onClick={handleFacebookLogin}>
            <img src={FacebookLogo} alt="Facebook Logo" className="h-6 w-full" />
          </button>
        </div>
        <div className="w-3/4 pt-2 text-gray-300">
          Don&apos;t have an account? Create a new account{' '}
          <Link to="/signup" className="text-orange-500 font-bold hover:underline">
            Here!
          </Link>
        </div>
      </div>
      <SideImage/>
    </div>
  );
}
