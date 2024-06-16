import { useAuth } from '../contexts/AuthContext'; 
import { signOut } from 'firebase/auth'; 
import { auth } from '../configs/firebaseConfig'; 
import { useNavigate } from 'react-router-dom'; 

export default function Home() {
  const { currentUser } = useAuth(); 
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      navigate('/'); 
    } catch (error) {
      console.error('Error signing out:', error);
      
    }
  };

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome, {currentUser.email}</h1>
        <button
          onClick={handleLogout}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
