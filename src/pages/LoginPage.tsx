import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { apiError } from "../api";
import Field from "../components/Field";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password)
      return setMessage("Completa el correo y la contraseña");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setMessage(apiError(err).message);
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 flex flex-col gap-3 bg-white rounded shadow p-6"
    >
      <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
      <Field label="Correo">
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label="Contraseña">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      {message && <p className="text-red-600">{message}</p>}
      <button>Entrar</button>
      <Link to="/register" className="text-blue-600">
        Crear una cuenta
      </Link>
    </form>
  );
}
