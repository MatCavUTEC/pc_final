import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { apiError } from "../api";
import Field from "../components/Field";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim() || name.length > 100)
      newErrors.name =
        "El nombre es obligatorio y debe tener menos de 100 caracteres";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "El correo no es válido";
    if (!/^.{8,72}$/.test(password))
      newErrors.password = "La contraseña debe tener entre 8 y 72 caracteres";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setMessage(apiError(err).message);
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 flex flex-col gap-3 bg-white rounded shadow p-6"
    >
      <h1 className="text-2xl font-bold">Registro</h1>
      <Field label="Nombre" error={errors.name}>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Correo" error={errors.email}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label="Contraseña" error={errors.password}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      {message && <p className="text-red-600">{message}</p>}
      <button>Crear cuenta</button>
      <Link to="/login" className="text-blue-600">
        Ya tengo cuenta
      </Link>
    </form>
  );
}
