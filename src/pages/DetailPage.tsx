import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import api, { apiError } from "../api";
import Field from "../components/Field";
import type { Item } from "../types";

export default function DetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [topic, setTopic] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const { data } = await api.get(`/mentors/${id}`);
      setItem(data);
    } catch (err) {
      setMessage(apiError(err).message);
    }
  }
  useEffect(() => {
    load();
  }, [id]);
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    const newErrors: Record<string, string> = {};
    const text = topic.trim();
    if (!text) newErrors.topic = "Completa el tema";
    if (text.length < 5 || text.length > 100)
      newErrors.topic =
        "El tema no puede ser menor que 5 ni superar los 100 caracteres";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      await api.post(`/mentors/${id}/requests`, { topic: text });
      setMessage("Solicitud enviada correctamente");
      load();
    } catch (err) {
      const { code, message } = apiError(err);
      setMessage(
        code === "NO_CAPACITY"
          ? "El mentor ya no tiene cupos disponibles."
          : message,
      );
    }
  }

  async function handleCancel() {
    setMessage("");
    try {
      await api.patch(`/requests/${id}/cancel`);
      setMessage("Solicitud cancelada correctamente");
      load();
    } catch (err) {
      const { code, message } = apiError(err);
      if (code === "INVALID_STATE") {
        setMessage("La solicitud ya no está pendiente.");
        load();
      } else {
        setMessage(message);
      }
    }
  }

  if (!item) return <p>{message || "Cargando..."}</p>;

  return (
    <div className="flex flex-col gap-4">
      <Link to="/dashboard" className="text-blue-600">
        Volver
      </Link>
      <h1 className="text-2xl font-bold">{item.name}</h1>
      <p>
        {" "}
        Especialidad: {item.speciality} | Modalidad: {item.modality} | Espacios
        disponibles: {item.availableSlots} | Descripción: {item.description}
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 bg-white rounded shadow p-4"
      >
        <Field label="Tema de la solicitud" error={errors.topic}>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Tema"
          />
        </Field>
        {message && <p className="font-medium">{message}</p>}
        <button>Reservar</button>
      </form>
      {item.status === "PENDING" && (
        <button onClick={handleCancel} className="bg-red-600">
          Cancelar solicitud
        </button>
      )}
    </div>
  );
}
