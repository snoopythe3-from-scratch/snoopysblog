import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Account() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            {user ? "Your Account" : "Welcome"}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4">
          {user ? (
            <>
              <p className="text-gray-700">Welcome, <span className="font-medium">{user.email}</span> 🎉</p>
              <Button 
                onClick={handleLogout} 
                variant="destructive" 
                className="w-full"
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-600">What would you like to do?</p>
              <div className="flex gap-4 mt-2">
                <Link to="/login">
                  <Button className="w-28">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" className="w-28">Sign up</Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
