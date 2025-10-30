import React, { useEffect } from "react";
import "./style.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, signOut } from "firebase/auth";
import userImage from "../../assets/user.svg"

const Index = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  function logout() {
    try {
      // const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        toast.success("Logged out successfully");
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
        toast.error(error.message);
      });
    } catch (error) {
      toast.error(error.message);
    }
    
  }
  return (
    <div className="header">
      <p className="logo">financly</p>
      {user && (
        <div style={{display:"flex" , alignItems:"center" , gap:"0.5rem"}}>
          <img src={user.photoURL ? user.photoURL : userImage} alt="Userimage" style={{borderRadius: "50%" , width:"2rem" , height:"2rem"}} />
        <p className="logout" onClick={logout}>
          Logout
        </p>

        </div>
        
      )}
    
    </div>
    

  );
};

export default Index;
