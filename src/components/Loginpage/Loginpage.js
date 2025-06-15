import React, { useState, useEffect } from "react";
import "./Loginpage.css";
import logo from "../../assets/logo2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { UserSignIn, UserSignUp } from "../../Auth/UserAuth";
import { message } from "antd";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

function LoginPage({ name }) {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const navigate = useNavigate();
  const [signUser, setSignUser] = useState({
    username: "",
    email: "",
    password: "",
    number: "",
  });
  const isPro = useSelector((state) => state.isPro.isProfessional);
  const [messageApi, context] = message.useMessage();
  const sendMessage = (variant, messageText) => {
    messageApi.open({
      type: variant,
      content: messageText,
    });
  };

  const [user, setUser] = useState({
    email: localStorage.getItem('email') || "", // Retrieve email from localStorage if it exists
    password: "",
  });

  useEffect(() => {
    // Check if email is stored in localStorage and set it as default value
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setUser((prevUser) => ({
        ...prevUser,
        email: storedEmail,
      }));
    }
  }, []);

  // Onchange for Sign in User
  const onloadSignin = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser((user) => {
      return { ...user, [name]: value };
    });
  };

  // ON Change for Sign Up user
  const onloadSignUp = (e) => {
    const sign = e.target.name;
    const value = e.target.value;
    setSignUser((data) => {
      return { ...data, [sign]: value };
    });
  };

// Email validation regex
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Phone number validation (simple digits only, length 10-15)
const validatePhone = (number) => {
  const re = /^\d{10,15}$/;
  return re.test(number);
};

// Username validation (not empty)
const validateUsername = (username) => username.trim() !== "";

// Password validation (min 6 chars)
const validatePassword = (password) => password.length >= 6;

// Updated handlesignIn
const handlesignIn = async (e) => {
  e.preventDefault();
  if (!user.email || !user.password) {
    sendMessage("error", "Please fill in all fields.");
    return;
  }
  if (!validateEmail(user.email)) {
    sendMessage("error", "Invalid email format.");
    return;
  }
  if (isPro === true) {
    sendMessage("warning", "Please Logout from Professional Account !!");
    return;
  }
  sendMessage("warning", "Hold on Tight !!");
await UserSignIn(user, sendMessage, navigate);
localStorage.setItem('email', user.email); // Store here only after presumed success
setUser({ email: "", password: "" });
  setUser({ email: "", password: "" });
};

// Updated handleSignUp
const handleSignUp = async (e) => {
  e.preventDefault();
  const { username, email, password, number } = signUser;
  if (!username || !email || !password || !number) {
    sendMessage("error", "Fill all details first.");
    return;
  }
  if (!validateUsername(username)) {
    sendMessage("error", "Username cannot be empty.");
    return;
  }
  if (!validateEmail(email)) {
    sendMessage("error", "Invalid email format.");
    return;
  }
  if (!validatePhone(number)) {
    sendMessage("error", "Invalid phone number. Use 10 to 15 digits.");
    return;
  }
  if (!validatePassword(password)) {
    sendMessage("error", "Password must be at least 6 characters.");
    return;
  }
  sendMessage("warning", "Preparing Account!!");
  await UserSignUp(signUser, sendMessage, navigate, isPro);
  setSignUser({ email: "", username: "", password: "", number: "" });
};


  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };

  // Store email in localStorage when the email changes
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setUser((prevUser) => ({
      ...prevUser,
      email,
    }));

    // localStorage.setItem('email', email); // Store the email in localStorage
  };

  return (
    <div className={`loginContainer ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        {context}
        {/* Signin Page */}
        <div className="signin-signup">
          <form action="#" className="sign-in-form loginForm">
            <h2 className="title">Sign in</h2>

            <div className="input-field">
              <FontAwesomeIcon icon={faUser} className="my-auto mx-auto" />
              <input
                className="LoginInput"
                name="email"
                value={user.email}
                onChange={handleEmailChange} // Handle email change and store it
                required
                type="email"
                placeholder="Email ID"
              />
            </div>

            <div className="input-field">
              <FontAwesomeIcon icon={faLock} className="my-auto mx-auto" />
              <input
                className="LoginInput"
                type="password"
                value={user.password}
                required
                name="password"
                onChange={onloadSignin}
                placeholder="Password"
              />
            </div>

            <button className="btn" onClick={handlesignIn}>
              Sign In
            </button>

            <p className="social-text loginp"> or Sign in with </p>

             <Link
      to="/"
      style={{
        display: "inline-block",
        padding: "8px 8px",
        backgroundColor: "#f57c00",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "500",
        textDecoration: "none",
        borderRadius: "6px",
        lineHeight: "1", // ensures vertical centering
        cursor: "pointer",
      }}
    >
      Proceed to home
    </Link>
    <br></br>

            <div className="social-media">
              <a href="#!" className="social-icon">
                <FontAwesomeIcon icon={faGoogle} className="my-auto mx-auto" />
              </a>

              <a href="#!" className="social-icon">
                <FontAwesomeIcon
                  icon={faLinkedinIn}
                  className="my-auto mx-auto"
                />
              </a>
            </div>
          </form>

          <form action="#" className="sign-up-form loginForm">
            {/* Sign Up Page */}

            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <FontAwesomeIcon icon={faUser} className="my-auto mx-auto" />
              <input
                className="LoginInput"
                name="username"
                value={signUser.username}
                required
                onChange={onloadSignUp}
                type="text"
                placeholder="Username"
              />
            </div>
            <div className="input-field">
              <FontAwesomeIcon icon={faEnvelope} className="my-auto mx-auto" />
              <input
                className="LoginInput"
                type="email"
                required
                name="email"
                value={signUser.email}
                onChange={onloadSignUp}
                placeholder="Email"
              />
            </div>
            <div className="input-field">
              <FontAwesomeIcon icon={faPhone} className="my-auto mx-auto" />
              <input
                className="LoginInput"
                type="phone"
                name="number"
                required
                value={signUser.number}
                onChange={onloadSignUp}
                placeholder="Phone number"
              />
            </div>
            <div className="input-field">
              <FontAwesomeIcon icon={faLock} className="my-auto mx-auto" />
              <input
                className="LoginInput"
                name="password"
                value={signUser.password}
                onChange={onloadSignUp}
                required
                type="password"
                placeholder="Password"
              />
            </div>
            <button className="btn" onClick={handleSignUp}>
              Sign Up
            </button>
            <p className="social-text loginp">Or Sign up with</p>
             <Link
      to="/"
      style={{
        display: "inline-block",
        padding: "8px 8px",
        backgroundColor: "#f57c00",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "500",
        textDecoration: "none",
        borderRadius: "6px",
        lineHeight: "1", // ensures vertical centering
        cursor: "pointer",
      }}
    >
      Proceed to home
    </Link>
    <br></br>
            <div className="social-media">
              <a href="#!" className="social-icon">
                <FontAwesomeIcon icon={faGoogle} className="my-auto mx-auto" />
              </a>

              <a href="#!" className="social-icon">
                <FontAwesomeIcon
                  icon={faLinkedinIn}
                  className="my-auto mx-auto"
                />
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3 className="loginh3">
              New {name ? <span>{name}</span> : <span>user</span>} ?
            </h3>

            <p className="loginp">
              Fod Planet, your one stop solution for cravings
            </p>

            <button
              className="btn transparent text-white"
              onClick={handleSignUpClick}
            >
              Sign up
            </button>
          </div>

          <img src={logo} className="image" alt="" />
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h3 className="loginh3">Already Registered ?</h3>

            <p className="loginp">
               Fod Planet, your one stop solution for cravings
            </p>

            <button
              onClick={handleSignInClick}
              className="btn transparent text-white"
              id="sign-in-btn"
            >
              Sign in
            </button>
          </div>

          <img src={logo} className="image" alt="" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
