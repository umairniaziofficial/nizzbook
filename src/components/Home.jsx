import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../configs/firebaseConfig";
import { ChatEngine } from "react-chat-engine";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    const getFile = async (url) => {
      if (!url) return null; 
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], "userphoto.jpg", { type: "image/jpeg" });
    };

    const checkUserInChatEngine = async () => {
      try {
        await axios
          .get("https://api.chatengine.io/users/me/", {
            headers: {
              "project-id": "4efd7575-d44d-4231-a5e8-bb782bcf0d7e",
              "user-name": currentUser.email,
              "user-secret": currentUser.uid,
            },
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
        setLoading(false);
        console.log("User exists in Chat Engine.");
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("User not found in Chat Engine, creating a new user...");
          try {
            const formData = new FormData();
            formData.append("username", currentUser.email);
            formData.append("secret", currentUser.uid);

            if (currentUser.photoURL) {
              const photoFile = await getFile(currentUser.photoURL);
              if (photoFile) {
                formData.append("avatar", photoFile);
              }
            }

            await axios.post("https://api.chatengine.io/users/", formData, {
              headers: {
                "private-key": "96301bb0-ff26-40a1-a21f-803158fc53ed",
              },
            });

            setLoading(false);
            console.log("New user created in Chat Engine.");
          } catch (createError) {
            console.error("Error creating user in Chat Engine:", createError);
            setLoading(false);
          }
        } else {
          console.error("Error fetching user data from Chat Engine:", error);
          console.error("Response status:", error.response?.status);
          console.error("Response data:", error.response?.data);
          setLoading(false);
        }
      }
    };

    checkUserInChatEngine();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="main min-h-screen mx-auto">
      <nav className="flex items-center px-12 bg-slate-900 py-4 text-white text-xl">
        <div className="flex-1 tracking-widest">NizzBook</div>
        <button
          onClick={handleLogout}
          className="px-2 py-1 rounded-2xl hover:text-slate-700"
        >
          Logout
        </button>
      </nav>
      <div className="min-h-screen max-w-full mx-auto flex">
        
        <div className="w-full">
          <ChatEngine
            height="calc(100vh - 66px)"
            projectID="4efd7575-d44d-4231-a5e8-bb782bcf0d7e"
            userName="umair"
            userSecret="umair123"
          />
        </div>
      </div>
    </div>
  );
}
