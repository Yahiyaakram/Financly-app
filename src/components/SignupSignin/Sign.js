import React, { useState } from "react";
import "./style.css";
import Input from "../Input";
import Button from "../Button";
import { createUserWithEmailAndPassword , signInWithEmailAndPassword } from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider  } from "firebase/auth";
import { auth } from "../../firebase.js";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from "firebase/firestore";
// import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.js";

const provider = new GoogleAuthProvider();



const Sign = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function signupWithEmail() {
    setLoading(true);
    console.log("name ", name);
    console.log("email ", email);
    console.log("password ", password);
    console.log("confirmPassword ", confirmPassword);

    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword != ""
    ) {
      if (password == confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log("user: ", user);
            toast.success("user Created");
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            navigate("/dashboard")
            createDoc(user);

            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
            // ..
          });
      } else {
        toast.error("Password and confirm password are not equal. ");
        setLoading(false);
      }
    } else {
      toast.error("All fields  to be filled.");
      setLoading(false);
    }
  }

  function loginUsingEmail(params) {
    console.log("email: ", email);
    console.log("Password: ", password);
    setLoading(true)
    if (email !== "" &&  password !== "")
      {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User Loggedin: " , user);
        
        toast.success("You are LoggedIn")
        setLoading(false);
        navigate("/dashboard")
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false)
        toast.error(errorMessage)
        
      });

    } else {
      toast.error("All fields are mandatory")
      setLoading(false)
    }

    
  }

  async function createDoc(user) {
    if(!user) return
    const userRef = doc(db, "user", user.uid);
    const userData = await getDoc(userRef);
    if(!userData.exists()){
      try {
      await setDoc(doc(db, "user", user.uid), {
        name:user.displayName ? user.displayName : name,
        email: user.email,
        photoURL:user.photoURL ? user.photoURL : "" ,
        createdAt: new Date(),
      });
      toast.success("Doc Created ")
      
    } catch (error) {
      toast.error(error.message)
    }

    } else {
      // toast.error("Doc already exists. ")
      setLoading(false);
    }


    
    
  }

  function googleAuth() {
    // const auth = getAuth();
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
     .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log(user);
    createDoc(user)
    setLoading(false);
    navigate("/dasboard")
    toast.success("User Authorized.")
    
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    }).catch((error) => {
    // Handle Errors here.
    setLoading(false);
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    toast.error(error.message)
    // ...
  });
      
    } catch (error) {
      setLoading(false);
      toast.error(error.message)
      
    }
    

    
  }

  return (
    <>
      {loginForm ? (
        <>
          <div className="signup-wrapper">
            <h2 className="title">
              Login on <span style={{ color: "var(--theme)" }}>Financly</span>{" "}
            </h2>

            <form action="">
              <Input
                type="email"
                label={"Email"}
                state={email}
                setState={setEmail}
                placeholder={"Falah@gmail.com"}
              />

              <Input
                type="password"
                label={"password"}
                state={password}
                setState={setPassword}
                placeholder={"jon@123"}
              />

              <Button
                disabled={loading}
                text={
                  loading ? "Loading..." : " Login Using Email and Password"
                }
                onClick={loginUsingEmail}
              />
              <p style={{ textAlign: "center" }}>or</p>
              <Button
                text={loading ? "Loading..." : "Login Using Google"}
                blue={true}
                onClick={googleAuth}
              />
              <p
                style={{ textAlign: "center", cursor: "pointer" }}
                onClick={() => setLoginForm(!loginForm)}
              >
                or Don't have an account ? click here
              </p>
            </form>
          </div>
        </>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "var(--theme)" }}>Financly</span>{" "}
          </h2>

          <form action="">
            <Input
              label={"full name"}
              state={name}
              setState={setName}
              placeholder={"Falah bin niyaz"}
            />

            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"Falah@gmail.com"}
            />

            <Input
              type="password"
              label={"password"}
              state={password}
              setState={setPassword}
              placeholder={"jon@123"}
            />

            <Input
              type="password"
              label={"confirm password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"jon@123"}
            />

            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Signup with Email and Password"}
              onClick={signupWithEmail}
            />
            <p style={{ textAlign: "center" }}>or</p>
            <Button
              text={loading ? "Loading..." : "Login with Google"}
              blue={true}
              onClick={googleAuth}
            />
            <p
              style={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              or have an account already ? click here
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default Sign;
