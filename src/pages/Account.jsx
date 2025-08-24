import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Account() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // listen for auth state changes any change causes thiz
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // sign out and remove local data from browserz
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error.message);
      alert(`Error logging out: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {user ? (
        <>
          <p>Welcome, {user.email}!</p>
          <button onClick={handleLogout}>Log out</button>
        </>
      ) : (
        <>
          <p>What would you like to do?</p>
          <div style={{ marginTop: "10px" }}>
            <Link to="/login" style={{ marginRight: "15px" }}>Log in</Link>
            <Link to="/signup">Sign up</Link>
          </div>
        </>
      )}
    </div>
  );
}
