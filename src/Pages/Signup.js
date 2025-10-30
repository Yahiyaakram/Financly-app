import React from "react";
import Header from "../components/Header/Index";
import Signup1 from "../components/SignupSignin/Sign";

const Signup = () => {
  return (
    <div>
      <Header />
      <div className="wrapper">
        <Signup1 />
      </div>
    </div>
  );
};

export default Signup;
