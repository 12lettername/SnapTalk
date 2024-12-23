import React from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";
import "./auth.css";
import GoogleIcon from "@mui/icons-material/Google";
const cookies = new Cookies();

export const Auth = (props) => {
  const { setIsAuth } = props;
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="auth">
      <h1>Welcome to SnapTalk</h1>
      <p>Please sign in to continue</p>
      <button onClick={signInWithGoogle}>
        <GoogleIcon></GoogleIcon>Sign In with Google
      </button>
    </div>
  );
};
