import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import BarberRegister from "../Pages/BarberRegister";
import { useDispatch } from "react-redux";
import { professionalLogOut } from "../../Redux/Slices/professionalRedux";
import { userLogout } from "../../Redux/Slices/UserRedux";

const Header = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//code.tidio.co/gcakni5fpv5txertwqchvwgabaw1yzi9.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const [email, setEmail] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);


  const sendMessage = (textMessage) => {
    alert(textMessage);
  };

  const getDisplayName = (email) => {
    if (!email) return "";
    const username = email.split("@")[0];
    const match = username.match(/^[^\d]+/);
    return match ? match[0] : username;
  };
useEffect(() => {
  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cartItems.length);
  };

  // Initial load
  updateCartCount();

  // Listen for custom event
  window.addEventListener("cartUpdated", updateCartCount);

  // Cleanup listener on unmount
  return () => {
    window.removeEventListener("cartUpdated", updateCartCount);
  };
}, []);


const logOutHandle = () => {
  const confirmLogout = window.confirm(
    "Are you sure you want to log out? This will log you out of your account."
  );
  if (confirmLogout) {
    // Clear Redux states
    dispatch(userLogout());
    dispatch(professionalLogOut());

    // Clear local storage values
    localStorage.removeItem("userState");
    localStorage.removeItem("email");
    localStorage.removeItem("cart");  // Clear cart
    localStorage.removeItem("authState");  // Clear authState

    // Optional: Clear all of localStorage if necessary
    // localStorage.clear();

    setEmail(null);
    navigate("/");
    sendMessage("Logout Successful!");

    // Optional: Trigger a custom event to update cart display
    const event = new Event("cartUpdated");
    window.dispatchEvent(event);
  }
};


  useEffect(() => {
    const sendReminderEmails = async () => {
      try {
        const response = await fetch("http://localhost:5000/send-reminders", {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("Failed to send reminders");
        }
        console.log("Reminder emails sent successfully.");
      } catch (error) {
        console.error("Error sending reminder emails:", error);
      }
    };

    const interval = setInterval(sendReminderEmails, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (email) {
      localStorage.setItem("email", email);
    }
  }, [email]);

  const location = useLocation();
  const hideHeaderOnPath = [
    "/dashboard",
    "/dashboard/schedules-professional",
    "/dashboard/add-services",
    "/login",
  ];

  if (hideHeaderOnPath.includes(location.pathname)) {
    return null;
  }

  return (
    <div>
      <style>
        {`
          /* Animated marquee text */
          .marquee-header {
            background: #ff4da6;
            color: white;
            font-weight: bold;
            padding: 8px 20px;
            overflow: hidden;
            white-space: nowrap;
            box-sizing: border-box;
          }
          .marquee-header span {
            display: inline-block;
            padding-left: 100%;
            animation: marquee 15s linear infinite;
          }
          @keyframes marquee {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-100%, 0); }
          }

          /* Food Planet animated heading */
          .brand-heading {
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: 900;
            font-size: 28px;
            cursor: default;
          }
          .brand-heading .food {
            color: #ff4da6;
            position: relative;
            animation: pulse 3s infinite alternate;
          }
          .brand-heading .planet {
            color:rgb(0, 0, 0);
            position: relative;
            animation: glow 3s infinite alternate;
          }
          @keyframes pulse {
            0% { text-shadow: 0 0 5px #ff4da6; }
            100% { text-shadow: 0 0 20px #ff80c1; }
          }
          @keyframes glow {
            0% { text-shadow: 0 0 8px #ffd6eb; }
            100% { text-shadow: 0 0 25px #ffe6f0; }
          }

          /* Icon animation */
          .brand-icon {
            font-size: 28px;
            color: #ff4da6;
            animation: rotate 6s linear infinite;
            display: inline-block;
          }
          .brand-icon.planet-icon {
            color: #ffd6eb;
            animation-direction: reverse;
          }
          @keyframes rotate {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.2); }
            100% { transform: rotate(360deg) scale(1); }
          }

          /* Nav link hover styles */
          .nav-link-custom {
            padding: 6px 10px;
            color: #333;
            text-decoration: none;
            font-size: 14px;
            border-radius: 20px;
            transition: all 0.3s ease;
            font-weight: bold;
            white-space: nowrap;
          }
          .nav-link-custom:hover {
            color: #ff4da6;
            border: 1px solid #ff4da6;
            background: #ffd6eb;
          }

          /* Login button styling */
          .login-button {
            padding: 8px 14px;
            background: #ff4da6;
            border-radius: 20px;
            color: #fff;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s ease;
          }
          .login-button:hover {
            background: #ff80c1;
            color: #fff;
            transform: scale(1.05);
          }

          /* User avatar hover */
          .user-avatar {
            height: 40px;
            width: 40px;
            border-radius: 50%;
            border: 2px solid #ff4da6;
            cursor: pointer;
            transition: transform 0.3s ease;
          }
          .user-avatar:hover {
            transform: rotate(5deg) scale(1.1);
          }

          /* Dropdown menu */
          .dropdown-menu {
            min-width: 140px;
            font-size: 14px;
          }
          .dropdown-item {
            padding: 8px 12px;
            cursor: pointer;
            color: #333;
            text-decoration: none;
            display: block;
          }
          .dropdown-item:hover {
            background-color: #ffd6eb;
            color: #ff4da6;
          }
        `}
      </style>

      <div className="navbar-container">
        <div className="marquee-header">
          <span>
Welcome to Food Planet! Enjoy delicious meals delivered fast, fresh and the best flavors, the best prices, all in one place.          </span>
        </div>

        <div
          style={{
            background: "#ffe6f0",
            padding: "20px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "nowrap",
            boxShadow: "0 4px 12px rgba(255, 77, 166, 0.2)",
            height: "90px",
          }}
        >
          {/* Left: Brand Heading with icons */}
      <Link
  to="/"
  style={{
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    cursor: "pointer",    // <-- Add this line
  }}
  aria-label="Food Planet Home"
>
  <span className="brand-heading" aria-hidden="true">
    <span className="brand-icon" role="img" aria-label="Food">
      🍔
    </span>
    <span className="food">Food</span>
    <span className="planet">Planet</span>
    <span className="brand-icon planet-icon" role="img" aria-label="Planet">
      🌍
    </span>
  </span>
</Link>

          {/* Center: Nav Links */}
       <nav
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    whiteSpace: "nowrap",
  }}
>


  {[
    { to: "/search", text: "RESTAURENTS", icon: "🍽️" },
    { to: "/tablebooking", text: "TABLE BOOKING", icon: "📅" },
    { to: "/contact", text: "CONTACT US", icon: "☎️" },
    
  ].map((link, i) => (
    <Link key={i} to={link.to} className="nav-link-custom">
      <span style={{ marginRight: "6px" }}>{link.icon}</span>
      {link.text}
      
    </Link>
  ))}
</nav>

<Link to="/addtocart" style={{ position: "relative", marginLeft: "20px", color: "#ff4da6", fontSize: "24px", textDecoration: "none" }} aria-label="Cart">
  🛒
  {cartCount > 0 && (
    <span
      style={{
        position: "absolute",
        top: "-6px",
        right: "-10px",
        background: "#ff4da6",
        color: "white",
        borderRadius: "50%",
        padding: "1px 7px",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {cartCount}
    </span>
  )}
</Link>

          {/* Right: Email + Avatar/Login */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {email && (
              <span style={{ color: "#333", fontSize: "13px", marginRight: "5px" }}>
                <strong>{getDisplayName(email)}</strong>
              </span>
            )}
            {email ? (
              <div className="dropdown">
                <a
                  href="#!"
                  id="navbarDropdownMenuAvatar"
                  role="button"
                  data-mdb-toggle="dropdown"
                >
                  <img
                    src="https://png.pngtree.com/png-clipart/20220628/original/pngtree-food-logo-png-image_8239850.png"
                    alt="User Avatar"
                    className="user-avatar"
                  />
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdownMenuAvatar"
                >
                  <li>
                    <Link to="/Profile" className="dropdown-item">
                      My profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/order" className="dropdown-item">
                      Order History
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={logOutHandle}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <NavLink to="/login" className="login-button">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>

      <BarberRegister />
    </div>
  );
};

export default Header;
