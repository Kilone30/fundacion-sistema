"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CategoriaAPI {
  id: number;
  nombre: string;
}

export default function NuevaActividadPage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [categorias, setCategorias] = useState<CategoriaAPI[]>([]);
  const [categoriaId, setCategoriaId] = useState<string>("");
  const [publicarInmediato, setPublicarInmediato] = useState(true);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/categorias", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las categorías");
        return res.json();
      })
      .then((data: CategoriaAPI[]) => {
        setCategorias(data);
        if (data.length > 0) setCategoriaId(String(data[0].id));
      })
      .catch((err) => console.error(err));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!titulo || !descripcion || !fecha) {
      setError("Completa título, descripción y fecha.");
      return;
    }

    setGuardando(true);
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/actividades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        titulo,
        descripcion,
        fecha,
        categoriaId: categoriaId ? Number(categoriaId) : null,
        publicado: publicarInmediato,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo guardar la actividad");
        return res.json();
      })
      .then(() => router.push("/admin/actividades"))
      .catch((err) => setError(err.message))
      .finally(() => setGuardando(false));
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="font-semibold text-xl text-[#1B4C6E] mb-6">
        Nueva actividad
      </h1>

      <form onSubmit={handleSubmit}>
        <label className="block text-[12.5px] font-medium text-[#1B4C6E] mb-1.5">
          Título
        </label>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          maxLength={200}
          placeholder="Ej. Jornada de reforestación"
          className="w-full h-10 px-3 mb-4 border border-[#D5DEE4] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3DAA57]"
        />

        <label className="block text-[12.5px] font-medium text-[#1B4C6E] mb-1.5">
          Descripción
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Cuenta brevemente qué se hizo..."
          rows={3}
          className="w-full px-3 py-2 mb-4 border border-[#D5DEE4] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3DAA57]"
        />

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-[12.5px] font-medium text-[#1B4C6E] mb-1.5">
              Fecha de la actividad
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full h-10 px-3 border border-[#D5DEE4] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3DAA57]"
            />
          </div>
          <div>
            <label className="block text-[12.5px] font-medium text-[#1B4C6E] mb-1.5">
              Categoría
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full h-10 px-3 border border-[#D5DEE4] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3DAA57]"
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between px-3 py-2.5 bg-[#F7F9FA] rounded-lg mb-5">
          <span className="text-sm text-[#1B4C6E]">Publicar de inmediato</span>
          <button
            type="button"
            onClick={() => setPublicarInmediato((v) => !v)}
            style={{ background: publicarInmediato ? "#3DAA57" : "#D5DEE4" }}
            className="w-9 h-5 rounded-full relative transition"
          >
            <div
              style={{ left: publicarInmediato ? "18px" : "2px" }}
              className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all"
            />
          </button>
        </div>

        {error && <p className="text-sm text-red-700 mb-4">{error}</p>}

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => router.push("/admin/actividades")}
            className="flex-1 h-10 border border-[#D5DEE4] rounded-md text-sm text-[#1B4C6E]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="flex-1 h-10 bg-[#1B4C6E] text-white rounded-md text-sm font-medium hover:bg-[#163F5C] transition disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Guardar actividad"}
          </button>
        </div>
      </form>
    </div>
  );
}