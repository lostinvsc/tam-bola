"use client";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      if(localStorage.getItem("adminToken")){
        router.push("/admin")
      }
    }, [])
    


    const handleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const data = {
                username: username,
                password: password
            }
            const response = await axios.post("/api/login", data);
            console.log(response)
            if (response.data.token) {

                toast.success("Logged in successfully", {
                    position: "top-right",
                    autoClose: 3000,
                });

                localStorage.setItem("adminToken", response.data.token);
                router.push("/admin");

            } else {
                setError("Invalid credentials");
            }

        } catch (err) {
            setError("Invalid credentials.");
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 border rounded mb-4"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;
