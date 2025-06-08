import React, { useEffect, useState } from "react";
import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import moment from "moment";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userEmail) return;

      try {
        const q = query(
          collectionGroup(db, "items"),
          where("UserOrderedFrom", "==", userEmail)
        );

        const querySnapshot = await getDocs(q);
        console.log("Orders found:", querySnapshot.docs.length);
        querySnapshot.docs.forEach((doc) => {
          console.log("Order doc:", doc.id, doc.data());
        });

        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userEmail]);

  if (!userEmail) {
    return <div>Please log in to view your orders.</div>;
  }

  return (
    <div className="order-history-container" style={{ padding: "20px" }}>
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
            }}
          >
            <h3>Restaurant: {order.restaurant}</h3>
            <p>
              <strong>Order Date:</strong>{" "}
              {order.createdAt
                ? moment(order.createdAt.toDate()).format("MMMM Do YYYY, h:mm a")
                : "N/A"}
            </p>
            <p>
              <strong>Total:</strong> Rs. {order.total}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {order.status?.delivered ? "Delivered" : "Pending"}
            </p>

            <h4>Delivery Info</h4>
            <p><strong>Name:</strong> {order.deliveryDetails?.name}</p>
            <p><strong>Contact:</strong> {order.deliveryDetails?.contact}</p>
            <p><strong>Address:</strong> {order.deliveryDetails?.address}</p>
            <p><strong>Flat:</strong> {order.deliveryDetails?.flat}</p>
            <p><strong>Payment Method:</strong> {order.deliveryDetails?.paymentMethod}</p>

            <h4>Items</h4>
            {order.items?.map((item, idx) => (
              <div key={idx} style={{ marginBottom: "10px" }}>
                {item.ServiceImage && (
                  <img
                    src={item.ServiceImage}
                    alt={item.ServiceName}
                    style={{ width: "80px", borderRadius: "5px" }}
                  />
                )}
                <p>
                  <strong>{item.ServiceName}</strong> - {item.quantity} x Rs.{" "}
                  {item.Price}
                </p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
