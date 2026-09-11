"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Categoria = "Medio ambiente" | "Educación" | "Comunidad";

interface Foto {
  id: string;
  url: string; // en esta etapa, solo un color de ejemplo; luego será la URL real de la imagen subida
  esPortada: boolean;
}

const categorias: Categoria[] = ["Medio ambiente", "Educación", "Comunidad"];
const coloresEjemplo = ["#A9C7B0", "#8FB59B", "#729681", "#E3B49E", "#D69B80"];

export default function NuevaActividadPage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(""); // fecha en que OCURRIÓ la actividad
  const [categoria, setCategoria] = useState<Categoria>("Medio ambiente");
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [publicarInmediato, setPublicarInmediato] = useState(true);
  const [error, setError] = useState("");

  // Nota: la fecha/hora de PUBLICACIÓN no se pide aquí —
  // la genera automáticamente el backend al guardar (created_at),
  // igual que el usuario que la registra (usuario_id), ninguno de los dos
  // los captura el formulario.

  function agregarFotoDeEjemplo() {
    const color = coloresEjemplo[fotos.length % coloresEjemplo.length];
    const nuevaFoto: Foto = {
      id: crypto.randomUUID(),
      url: color,
      esPortada: fotos.length === 0, // la primera que subas queda como portada por defecto
    };
    setFotos((prev) => [...prev, nuevaFoto]);
  }

  function marcarComoPortada(id: string) {
    setFotos((prev) =>
      prev.map((f) => ({ ...f, esPortada: f.id === id }))
    );
  }

  function eliminarFoto(id: string) {
    setFotos((prev) => prev.filter((f) => f.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!titulo || !descripcion || !fecha) {
      setError("Completa título, descripción y fecha.");
      return;
    }
    if (fotos.length === 0) {
      setError("Agrega al menos una foto.");
      return;
    }

    // Aquí luego irá el fetch real a Spring Boot, ej:
    // POST /api/actividades  { titulo, descripcion, fecha, categoria, fotos, publicarInmediato }
    console.log({ titulo, descripcion, fecha, categoria, fotos, publicarInmediato });

    router.push("/admin/actividades");
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

        <div className="grid grid-cols-2 gap-3 mb-4">
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
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as Categoria)}
              className="w-full h-10 px-3 border border-[#D5DEE4] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3DAA57]"
            >
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="block text-[12.5px] font-medium text-[#1B4C6E] mb-2">
          Fotos (toca una para marcarla como portada)
        </label>
        <div className="grid grid-cols-4 gap-2 mb-1.5">
          {fotos.map((foto) => (
            <button
              type="button"
              key={foto.id}
              onClick={() => marcarComoPortada(foto.id)}
              onDoubleClick={() => eliminarFoto(foto.id)}
              style={{
                background: foto.url,
                border: foto.esPortada ? "2px solid #3DAA57" : "2px solid transparent",
              }}
              className="aspect-square rounded-lg relative"
            >
              {foto.esPortada && (
                <span className="absolute top-1 right-1 bg-[#3DAA57] text-white text-[9px] px-1.5 py-0.5 rounded-full">
                  Portada
                </span>
              )}
            </button>
          ))}

          <button
            type="button"
            onClick={agregarFotoDeEjemplo}
            className="aspect-square rounded-lg border-[1.5px] border-dashed border-[#C7CED2] flex items-center justify-center text-[#8A97A0] text-xl"
          >
            +
          </button>
        </div>
        <p className="text-[11px] text-[#8A97A0] mb-5">
          La portada aparece primero en la lista pública. Doble clic para eliminar una foto.
        </p>

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
            className="flex-1 h-10 bg-[#1B4C6E] text-white rounded-md text-sm font-medium hover:bg-[#163F5C] transition"
          >
            Guardar actividad
          </button>
        </div>
      </form>
    </div>
  );
}