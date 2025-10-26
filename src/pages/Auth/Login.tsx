import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate("/dashboard");
        } else {
            alert("Неверный логин или пароль");
        }
    }

    return (
        <div className="page page-center">
            <div className="container-tight py-4">
                <form className="card card-md" onSubmit={handleSubmit}>
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">Вход</h2>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Пароль</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Войти
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
