"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Legend, Tooltip } from "recharts";

type TipoGrafica = "pastel" | "barras";

interface Segmento {
  id: string;
  etiqueta: string;
  valor: string;
}

// Esto luego vendrá de un fetch real a GET /api/actividades
const actividadesDisponibles = [
  { id: "general", titulo: "Estadística general (sin actividad)" },
  { id: "1", titulo: "Jornada de reforestación" },
  { id: "2", titulo: "Taller de repostería inclusivo" },
  { id: "3", titulo: "Venta por una buena causa" },
];

const coloresSegmento = ["#3DAA57", "#F2A93E", "#E8734A", "#1B4C6E", "#8A97A0"];

export default function NuevaGraficaPage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState<TipoGrafica>("pastel");
  const [actividadId, setActividadId] = useState(""); // obligatorio: "" = sin elegir aún
  const [segmentos, setSegmentos] = useState<Segmento[]>([
    { id: crypto.randomUUID(), etiqueta: "", valor: "" },
    { id: crypto.randomUUID(), etiqueta: "", valor: "" },
  ]);
  const [error, setError] = useState("");

  function actualizarSegmento(id: string, campo: "etiqueta" | "valor", valor: string) {
    setSegmentos((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [campo]: valor } : s))
    );
  }

  function agregarSegmento() {
    setSegmentos((prev) => [...prev, { id: crypto.randomUUID(), etiqueta: "", valor: "" }]);
  }

  function eliminarSegmento(id: string) {
    if (segmentos.length <= 1) return; // siempre debe quedar al menos uno
    setSegmentos((prev) => prev.filter((s) => s.id !== id));
  }

  // Datos listos para Recharts: solo los segmentos con etiqueta y valor numérico válido
  const datosGrafica = segmentos
    .filter((s) => s.etiqueta.trim() !== "" && s.valor.trim() !== "" && !isNaN(Number(s.valor)))
    .map((s) => ({ name: s.etiqueta, value: Number(s.valor) }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!titulo) {
      setError("Ponle un título a la gráfica.");
      return;
    }
    if (!actividadId) {
      setError("Selecciona una actividad (o 'Estadística general').");
      return;
    }
    if (datosGrafica.length < 2) {
      setError("Agrega al menos 2 segmentos con etiqueta y valor.");
      return;
    }

    // Luego irá el fetch real:
    // POST /api/graficas
    // { titulo, tipo, actividad_id: actividadId === "general" ? null : actividadId, segmentos: datosGrafica }
    console.log({ titulo, tipo, actividadId, segmentos: datosGrafica });

    router.push("/admin/graficas");
  }

  return (
    <div>
      <h1 className="font-semibold text-xl text-[#1B4C6E] mb-6">Nueva gráfica</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
        {/* Columna izquierda: configuración */}
        <div>
          <label className="block text-[12.5px] font-medium text-[#1B4C6E] mb-1.5">
            Título
          </label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej. Asistencia por género"
            className="w-full h-10 px-3 mb-4 border border-[#D5DEE4] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3DAA57]"
          />

          <label className="block text-[12.5px] font-medium text-[#1B4C6E] mb-1.5">
            Tipo de gráfica
          </label>
          <div className="flex gap-2 mb-4">
            {(["pastel", "barras"] as TipoGrafica[]).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTipo(t)}
                className={`flex-1 h-9 rounded-md text-[12.5px] font-medium capitalize border transition ${
                  tipo === t
                    ? "border-[#3DAA57] bg-[#EAF7EE] text-[#2C7A3F]"
                    : "border-[#D5DEE4] text-[#8A97A0]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <label className="block text-[12.5px] font-medium text-[#1B4C6E] mb-1.5">
            Segmentos
          </label>
          <div className="flex flex-col gap-1.5 mb-1">
            {segmentos.map((s) => (
              <div key={s.id} className="flex gap-1.5">
                <input
                  value={s.etiqueta}
                  onChange={(e) => actualizarSegmento(s.id, "etiqueta", e.target.value)}
                  placeholder="Etiqueta (ej. Hombres)"
                  className="flex-[2] h-9 px-2.5 border border-[#D5DEE4] rounded-md text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[#3DAA57]"
                />
                <input
                  value={s.valor}
                  onChange={(e) => actualizarSegmento(s.id, "valor", e.target.value)}
                  placeholder="Valor"
                  inputMode="numeric"
                  className="flex-1 h-9 px-2.5 border border-[#D5DEE4] rounded-md text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[#3DAA57]"
                />
                <button
                  type="button"
                  onClick={() => eliminarSegmento(s.id)}
                  className="w-9 h-9 flex items-center justify-center text-[#B14A3B]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={agregarSegmento}
            className="w-full h-9 border border-dashed border-[#C7CED2] rounded-md text-[12.5px] text-[#8A97A0] mb-4"
          >
            + Agregar segmento
          </button>

          <label className="block text-[12.5px] font-medium text-[#1B4C6E] mb-1.5">
            Actividad relacionada
          </label>
          <select
            value={actividadId}
            onChange={(e) => setActividadId(e.target.value)}
            className="w-full h-10 px-3 border border-[#D5DEE4] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3DAA57]"
          >
            <option value="" disabled>
              Selecciona una opción...
            </option>
            {actividadesDisponibles.map((a) => (
              <option key={a.id} value={a.id}>
                {a.titulo}
              </option>
            ))}
          </select>
        </div>

        {/* Columna derecha: vista previa en vivo */}
        <div>
          <p className="text-[11.5px] text-[#8A97A0] font-medium mb-2.5">Vista previa</p>
          <div className="border border-[#E4E9ED] rounded-xl p-6 flex flex-col items-center justify-center min-h-[280px]">
            {datosGrafica.length < 2 ? (
              <p className="text-[12.5px] text-[#B5BEC4] text-center">
                Agrega al menos 2 segmentos con etiqueta y valor para ver la vista previa.
              </p>
            ) : tipo === "pastel" ? (
              <PieChart width={260} height={220}>
                <Pie
                  data={datosGrafica}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  innerRadius={45}
                >
                  {datosGrafica.map((_, i) => (
                    <Cell key={i} fill={coloresSegmento[i % coloresSegmento.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            ) : (
              <BarChart width={280} height={220} data={datosGrafica}>
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="value" fill="#3DAA57" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </div>
        </div>

        {error && (
          <p className="col-span-2 text-sm text-red-700">{error}</p>
        )}

        <div className="col-span-2 flex gap-2.5 max-w-md">
          <button
            type="button"
            onClick={() => router.push("/admin/graficas")}
            className="flex-1 h-10 border border-[#D5DEE4] rounded-md text-sm text-[#1B4C6E]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 h-10 bg-[#1B4C6E] text-white rounded-md text-sm font-medium hover:bg-[#163F5C] transition"
          >
            Guardar gráfica
          </button>
        </div>
      </form>
    </div>
  );
}