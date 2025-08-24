import React from "react";
import { Link } from "react-router-dom";
export default function Account() {
    return (
        <>
        <p>What would you like to do</p>
        <Link to="/login">Log in </Link>
        <Link to="/signup">Sign up</Link>
        </>
    )
}