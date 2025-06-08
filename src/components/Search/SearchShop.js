import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import BreadCrumbs from "../BreadCrumbs/Breadcrumb";
import SearchContent from "./SearchContent";
import Loader from "../Loader/loader";
import { NavLink } from "react-router-dom";
import Footer from "../Footer/Footer";

// Firebase Configuration
const config = {
  apiKey: "AIzaSyAd0K-Y8AnNXSJXQRZeQtphPZQPOkSAgmo",
  authDomain: "foodplanet-82388.firebaseapp.com",
  projectId: "foodplanet-82388",
  storageBucket: "foodplanet-82388.firebasestorage.app",
  messagingSenderId: "898880937459",
  appId: "1:898880937459:web:2c23717c73ffdf2eef8686",
  measurementId: "G-CPEP0M2EXG",
};

const SearchShop = () => {
  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState(""); // Price filter state
  const [ratingFilter, setRatingFilter] = useState(""); // Rating filter state
  const [serviceFilter, setServiceFilter] = useState(""); // Service filter state
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const shopsPerPage = 10; // Number of RESTAURENTS to display per page

  // Initialize Firebase
  const app = initializeApp(config);
  const db = getFirestore(app);

  // Fetch shops and their services from Firebase
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ProfessionalDB"));
        const shopData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const servicesSnapshot = await getDocs(
              collection(db, "ProfessionalDB", doc.id, "Services")
            );
            const services = servicesSnapshot.docs.map((serviceDoc) => ({
              id: serviceDoc.id,
              ...serviceDoc.data(),
            }));

            const reviewsSnapshot = await getDocs(
              collection(db, "ProfessionalDB", doc.id, "Reviews")
            );
            const reviews = reviewsSnapshot.docs.map((reviewDoc) => ({
              id: reviewDoc.id,
              ...reviewDoc.data(),
            }));

            // Calculate average rating
            const avgRating =
              reviews.length > 0
                ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                  reviews.length
                : 0;

            return {
              id: doc.id,
              ...doc.data(),
              services,
              reviews,
              avgRating,
            };
          })
        );

        setShops(shopData);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [db]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to clear all filters
  const clearFilters = () => {
    setSearch("");
    setPriceFilter("");
    setRatingFilter("");
    setServiceFilter("");
  };

  // Filtering Logic
  const filteredShops = shops
    .map((shop) => {
      const isAllFiltersSelected =
        (priceFilter === "" || priceFilter === "All") &&
        (ratingFilter === "" || ratingFilter === "All") &&
        (serviceFilter === "" || serviceFilter === "All") &&
        search.trim() === "";

      // When all filters are default, return only shop info without services
      if (isAllFiltersSelected) {
        return {
          ...shop,
          services: [], // Don't show any services
        };
      }

      const matchedServices = shop.services.filter((service) => {
        const price = parseInt(service.Price || 0);

        const matchesSearch =
          search === "" ||
          service.ServiceName?.toLowerCase().includes(search.toLowerCase()) ||
          shop.shopName?.toLowerCase().includes(search.toLowerCase());

        const matchesServiceType =
          serviceFilter === "" ||
          serviceFilter === "All" ||
          (service.Category &&
            service.Category.toLowerCase().includes(
              serviceFilter.toLowerCase()
            ));

        const matchesPrice =
          priceFilter === "" ||
          (() => {
            switch (priceFilter) {
              case "0-1000":
                return price <= 1000;
              case "1000-3000":
                return price > 1000 && price <= 3000;
              case "3000-5000":
                return price > 3000 && price <= 5000;
              case "5000-10000":
                return price > 5000 && price <= 10000;
              case "10000-20000":
                return price > 10000 && price <= 20000;
              case "20000-50000":
                return price > 20000 && price <= 50000;
              case "50000-100000":
                return price > 50000 && price <= 100000;
              case "100000-200000":
                return price > 100000 && price <= 200000;
              case "200000-500000":
                return price > 200000 && price <= 500000;
              default:
                return true;
            }
          })();

        return matchesSearch && matchesServiceType && matchesPrice;
      });

      const matchesRating =
        ratingFilter === "" || shop.avgRating >= parseInt(ratingFilter, 10);

      if (matchedServices.length > 0 && matchesRating) {
        return {
          ...shop,
          services: matchedServices,
        };
      }

      return null;
    })
    .filter(Boolean); // Remove nulls

  // Pagination logic: slice filteredShops to only show current page's items
  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  const currentShops = filteredShops.slice(indexOfFirstShop, indexOfLastShop);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mb-3">
      <div className="bg-white">
        <div className="container pt-3 pb-5">
          <BreadCrumbs text="black" activePage={"Search"} />

          {/* Continuous Infinite Marquee with More Items */}
<div
  style={{
    overflow: "hidden",
    whiteSpace: "nowrap",
    borderRadius: "16px",
    border: "2px solid rgb(1, 5, 12)",
    padding: "8px 0",
    marginBottom: "16px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(13, 110, 253, 0.15)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  }}
>
  <div
    style={{
      display: "inline-flex",
      animation: "marquee 30s linear infinite",
    }}
  >
    {[ // List of items, repeated twice for seamless scrolling
      { name: "Pulao", img: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png" },
      { name: "Biryani", img: "https://cdn-icons-png.flaticon.com/512/590/590685.png" },
      { name: "Zinger", img: "https://cdn-icons-png.flaticon.com/512/1046/1046787.png" },
      { name: "Burger", img: "https://cdn-icons-png.flaticon.com/512/1046/1046788.png" },
      { name: "Pizza", img: "https://cdn-icons-png.flaticon.com/512/1046/1046783.png" },
      { name: "Fries", img: "https://cdn-icons-png.flaticon.com/512/1046/1046785.png" },
      { name: "Sandwich", img: "https://cdn-icons-png.flaticon.com/512/1046/1046790.png" },
      { name: "Taco", img: "https://cdn-icons-png.flaticon.com/512/1046/1046791.png" },
      { name: "Sushi", img: "https://cdn-icons-png.flaticon.com/512/1046/1046789.png" },
      { name: "Doughnut", img: "https://cdn-icons-png.flaticon.com/512/1046/1046792.png" },
    ].concat([ // repeat same items to create seamless loop
      { name: "Pulao", img: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png" },
      { name: "Biryani", img: "https://cdn-icons-png.flaticon.com/512/590/590685.png" },
      { name: "Zinger", img: "https://cdn-icons-png.flaticon.com/512/1046/1046787.png" },
      { name: "Burger", img: "https://cdn-icons-png.flaticon.com/512/1046/1046788.png" },
      { name: "Pizza", img: "https://cdn-icons-png.flaticon.com/512/1046/1046783.png" },
      { name: "Fries", img: "https://cdn-icons-png.flaticon.com/512/1046/1046785.png" },
      { name: "Sandwich", img: "https://cdn-icons-png.flaticon.com/512/1046/1046790.png" },
      { name: "Taco", img: "https://cdn-icons-png.flaticon.com/512/1046/1046791.png" },
      { name: "Sushi", img: "https://cdn-icons-png.flaticon.com/512/1046/1046789.png" },
      { name: "Doughnut", img: "https://cdn-icons-png.flaticon.com/512/1046/1046792.png" },
    ]).map((item, index) => (
      <div
        key={index}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          marginRight: "28px",
          cursor: "pointer",
          transition: "transform 0.3s ease",
          minWidth: "90px",
        }}
        title={item.name}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.15)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        <img
          src={item.img}
          alt={item.name}
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "2px solid rgb(5, 13, 26)",
            objectFit: "cover",
            marginBottom: "6px",
            boxShadow: "0 3px 6px rgba(5, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        />
        <span
          style={{
            fontWeight: "600",
            color: "#0d6efd",
            fontSize: "13px",
            letterSpacing: "0.5px",
            userSelect: "none",
          }}
        >
          {item.name}
        </span>
      </div>
    ))}
  </div>

  <style>
    {`
      @keyframes marquee {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
    `}
  </style>
</div>


          {/* Search Bar */}
          <div className="d-flex justify-content-center align-items-center pt-3">
            <input
              placeholder="Search Restaurent"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="HomeSearch"
              style={{
                width: "75%",
                padding: "10px 15px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                outline: "none",
              }}
            />
            <span
              className="material-icons py-3 px-3 bg-black text-white border-dark border border-start-0"
              style={{
                cursor: "pointer",
                background: "#333",
                borderRadius: "5px 0 0 5px",
              }}
            >
              search
            </span>
          </div>

          {/* Filters Section */}
          <div className="mt-4 border p-3 rounded bg-light">
            <h6 className="fw-bold">FILTERS:</h6>
            <div className="row">
              {/* Price Filter */}
              <div className="col-md-4">
                <label className="fw-semibold">PRICE RANGE</label>
                <select
                  className="form-control"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="0-1000">Below 1,000</option>
                  <option value="1000-3000">1,000 - 3,000</option>
                  <option value="3000-5000">3,000 - 5,000</option>
                  <option value="5000-10000">5,000 - 10,000</option>
                  <option value="10000-20000">10,000 - 20,000</option>
                  <option value="20000-50000">20,000 - 50,000</option>
                  <option value="50000-100000">50,000 - 100,000</option>
                  <option value="100000-200000">100,000 - 200,000</option>
                  <option value="200000-500000">200,000 - 500,000</option>
                </select>
              </div>

              {/* Ratings Filter */}
              <div className="col-md-4">
                <label className="fw-semibold">MINIMUM RATING</label>
                <select
                  className="form-control"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="1">1 Star & Above</option>
                  <option value="2">2 Stars & Above</option>
                  <option value="3">3 Stars & Above</option>
                  <option value="4">4 Stars & Above</option>
                  <option value="5">5 Stars Only</option>
                </select>
              </div>

              {/* Service Type Filter */}
              <div className="col-md-4">
                <label className="fw-semibold">SERVICE TYPE</label>
                <select
                  className="form-control"
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                >
                  <option value="">Select Food Category</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Bakery & Desserts">Bakery</option>
              <option value="Beverages">Beverages</option>
              <option value="Seafood">Seafood</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="BBQ & Grills">BBQ & Grills</option>
              <option value="Traditional Cuisine">Traditional Cuisine</option>
              <option value="Healthy & Organic">Healthy & Organic</option>
              <option value="Pakistani">Pakistani</option>
              <option value="Chinese">Chinese</option>
              <option value="Desserts">Desserts</option>
              <option value="Frozen Item">Frozen Item</option>
              <option value="Salads">Salads</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-3 text-end">
              <button className="btn btn-danger" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="mt-5 container">
        <div className="border p-3">
          {loading ? (
            <Loader />
          ) : (
            currentShops.map((res) => (
              <div
                key={res.id}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                {res.bookingStatus ? (
                  <NavLink to={`/shop/${res.id}`}>
                    <SearchContent data={res} />
                  </NavLink>
                ) : (
                  <div
                    style={
                      {
                        // display: "block",
                        // width: "100%",
                        // textDecoration: "none",
                        // borderRadius: "10px",
                        // background: "#f4f4f4",
                        // padding: "20px",
                        // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        // textAlign: "center",
                        // color: "#777",
                        // fontSize: "18px",
                        // fontWeight: "600",
                        // transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      }
                    }
                  >
                    {/* <h4>{res.shopName} - Currently Unavailable</h4>
                    <p>Sorry, the salon is not accepting bookings at this time.</p> */}
                  </div>
                )}
              </div>
            ))
          )}

          {/* Pagination */}
          <div
            className="d-flex justify-content-center mt-4"
            style={{
              animation: "fadeIn 1s ease-in-out",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
              backgroundColor: "#111",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
            }}
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn"
              style={{
                backgroundColor: "#333",
                color: "#fff",
                borderRadius: "50px",
                border: "2px solid #007bff",
                padding: "12px 24px",
                fontSize: "16px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                transition: "all 0.3s ease-in-out",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                marginRight: "15px",
                transform: "scale(1)",
              }}
              // disabled={currentPage === 1}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.1)";
                e.target.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.3)";
                e.target.style.backgroundColor = "#555";
                e.target.style.animation = "pulse 1.5s infinite";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
                e.target.style.backgroundColor = "#333";
                e.target.style.animation = "none"; // Remove pulse effect on mouse leave
              }}
            >
              Previous
            </button>

            <span
              className="mx-3"
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#fff",
                textAlign: "center",
                position: "relative",
                animation: "slideIn 1s ease-in-out",
                textShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
              }}
            >
              Page {currentPage}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * shopsPerPage >= filteredShops.length}
              className="btn"
              style={{
                backgroundColor: "#333",
                color: "#fff",
                borderRadius: "50px",
                border: "2px solid #007bff",
                padding: "12px 24px",
                fontSize: "16px",
                cursor:
                  currentPage * shopsPerPage >= filteredShops.length
                    ? "not-allowed"
                    : "pointer",
                transition: "all 0.3s ease-in-out",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                marginLeft: "15px",
                transform: "scale(1)",
              }}
              // disabled={currentPage * shopsPerPage >= filteredShops.length}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.1)";
                e.target.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.3)";
                e.target.style.backgroundColor = "#555";
                e.target.style.animation = "pulse 1.5s infinite";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
                e.target.style.backgroundColor = "#333";
                e.target.style.animation = "none"; // Remove pulse effect on mouse leave
              }}
            >
              Next
            </button>
          </div>

          {/* Keyframes for animations */}
          <div
            style={{
              "@keyframes fadeIn": {
                "0%": { opacity: 0 },
                "100%": { opacity: 1 },
              },
              "@keyframes slideIn": {
                "0%": { transform: "translateX(-50px)", opacity: 0 },
                "100%": { transform: "translateX(0)", opacity: 1 },
              },
              "@keyframes pulse": {
                "0%": { transform: "scale(1)", opacity: 1 },
                "50%": { transform: "scale(1.1)", opacity: 0.8 },
                "100%": { transform: "scale(1)", opacity: 1 },
              },
            }}
          ></div>
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <Footer />
    </div>
  );
};

export default SearchShop;
