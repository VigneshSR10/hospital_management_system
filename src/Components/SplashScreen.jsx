import React from "react";
import HMS from '../assets/Images/HMS.svg'
export default function SplashScreen() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#E0E6F1",
        color: "#2D6FB6",
        fontSize: "22px",
        fontWeight: 600,
        gap:'3%',
        flexDirection:'column'
      }}
    >
        <img src={HMS} alt="Hospital Logo" className="logo-img" />
       Loading...
    </div>
  );
}
