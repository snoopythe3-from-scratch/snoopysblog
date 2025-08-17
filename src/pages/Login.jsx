import { useEffect, useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState(null);

  const REDIRECT_URI = window.location.origin + "/login";

  useEffect(() => {
    // Check sessionStorage first (restore session)
    const savedUser = sessionStorage.getItem("scratchUser");
    if (savedUser && !user) {
      setUser(JSON.parse(savedUser));
      return;
    }

    // Check if redirected back with ?id
    const params = new URLSearchParams(window.location.search);
    const token = params.get("id");
    if (token && !user) {
      // Parse token response directly from API
      fetch(`https://corsproxy.io?url=https://scratch-id.onrender.com/verification/${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            setUser(data.token);
            sessionStorage.setItem("scratchUser", JSON.stringify(data.token));
          }
        })
        .catch(err => console.error("auth error:", err));
    }
  }, [user]);

  const handleLogin = () => {
    const redirectParam = btoa(REDIRECT_URI);
    window.location.href = `https://scratch-id.onrender.com/?redirect=${redirectParam}&name=${encodeURIComponent(
      "The Scratch Channel"
    )}`;
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("scratchUser");
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f3f4f6"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "1rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "22rem",
        textAlign: "center"
      }}>
        {!user ? (
          <>
            <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>
              Login with Scratch
            </h1>
            <button
              onClick={handleLogin}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#4f46e5",
                color: "white",
                fontWeight: "bold",
                border: "none",
                borderRadius: "0.75rem",
                cursor: "pointer"
              }}
            >
              Login with Scratch
            </button>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              Welcome, {user.username}!
            </h1>
            {user.id && (
              <img
                src={`https://uploads.scratch.mit.edu/users/avatars/${user.id}.png`}
                alt="avatar"
                style={{
                  borderRadius: "50%",
                  width: "6rem",
                  height: "6rem",
                  margin: "0 auto"
                }}
              />
            )}
            <p style={{ marginTop: "0.75rem", color: "#4b5563" }}>
              Welcome To Your Account!
            </p>
            <button
              onClick={handleLogout}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
