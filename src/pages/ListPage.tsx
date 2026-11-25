import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiError } from "../api";
import Pagination from "../components/Pagination";
import type { Item } from "../types";

export default function ListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data } = await api.get("/mentors", {
          params: { page, size: 5 },
        });
        setItems(data.items);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(apiError(err).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Mentores</h1>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && items.length === 0 && <p>No hay mentores disponibles</p>}
      {!loading &&
        items.map((item) => (
          <Link
            key={item.id}
            to={`/mentors/${item.id}`}
            className="bg-white rounded shadow p-4 hover:bg-blue-50"
          >
            <p className="font-bold">{item.name}</p>
            <p>
              {" "}
              Especialidad: {item.speciality} | Modalidad: {item.modality} |
              Espacios disponibles: {item.availableSlots} | Descripción:{" "}
              {item.description}
            </p>
          </Link>
        ))}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
