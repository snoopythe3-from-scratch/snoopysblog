import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    useEffect(() => {
        onAuthStateChanged(auth, (u) => {
            setUser(u);
        });
    }, []);
    useEffect(() => {
        async function fetchUsers() {
            const snapshot = await getDocs(collection(db, "users"));
            const userList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setUsers(userList);
            setLoading(false);
        }
        fetchUsers();
    }, []);
    if (loading) return <p>Loading...</p>;
    return (
        <div>
            <h2>User List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>{u.writer ? "Yes" : "No"}</td>
                            <td>
                                {user && user.uid !== u.id && (
                                    <Link to={`/users/${u.username}/admin/create`}>Make Admin</Link>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}