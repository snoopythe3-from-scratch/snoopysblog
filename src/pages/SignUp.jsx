import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            // create user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // usernam functionality using firestore
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: user.email,
                createdAt: new Date(),
                writer: false
            })
            console.log("user registered", user);

        } catch (error) {
            console.error("error signing up", error.message);
        }
    };
    return (
        <form onSubmit={handleSignUp}>
            <h2>Sign Up with Username</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <button type="submit">Register</button>
        </form>
    )
}