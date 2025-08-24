import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSignIn = async (e) => {
		e.preventDefault();
		try {
			await signInWithEmailAndPassword(auth, email, password);
			console.log(`User ${email} signed in successfully`);
		} catch (error) {
			console.error("Error signing in", error.message);
		}
	};
	return (
		<form onSubmit={handleSignIn}>
			<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
			<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
			<button type="submit">Sign In</button>
		</form>
	)
}