"use client";

import { useState } from "react";
import Link from "next/link";

type Categoria = "Medio ambiente" | "Educación" | "Comunidad";

interface Actividad {
  id: number;
  titulo: string;
  categoria: Categoria;
  fecha: string;
  publicadoPor: string;
  publicada: boolean;
  colorCover: string;
}

const categoriaColores: Record<Categoria, { bg: string; text: string }> = {
  "Medio ambiente": { bg: "#E9F7EC", text: "#2C7A3F" },
  "Educación": { bg: "#FDEDEC", text: "#B14A3B" },
  "Comunidad": { bg: "#FFF3E0", text: "#B36A00" },
};

const actividadesIniciales: Actividad[] = [
  {
    id: 1,
    titulo: "Jornada de reforestación",
    categoria: "Medio ambiente",
    fecha: "15 sep 2026",
    publicadoPor: "Jorge Pérez",
    publicada: true,
    colorCover: "#A9C7B0",
  },
  {
    id: 2,
    titulo: "Taller de repostería inclusivo",
    categoria: "Educación",
    fecha: "2 sep 2026",
    publicadoPor: "Ana López",
    publicada: true,
    colorCover: "#E3B49E",
  },
  {
    id: 3,
    titulo: "Venta por una buena causa",
    categoria: "Comunidad",
    fecha: "28 ago 2026",
    publicadoPor: "Guillermina P.",
    publicada: false,
    colorCover: "#C7CBB8",
  },
];

export default function ActividadesAdminPage() {
  const [actividades, setActividades] = useState<Actividad[]>(actividadesIniciales);

  function togglePublicada(id: number) {
    setActividades((prev) =>
      prev.map((a) => (a.id === id ? { ...a, publicada: !a.publicada } : a))
    );
  }

  function eliminarActividad(id: number) {
    const actividad = actividades.find((a) => a.id === id);
    if (!actividad) return;
    const confirmar = window.confirm(
      `¿Eliminar "${actividad.titulo}"? Esta acción no se puede deshacer.`
    );
    if (confirmar) {
      setActividades((prev) => prev.filter((a) => a.id !== id));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-semibold text-xl text-[#1B4C6E]">Actividades</h1>
          <p className="text-[12.5px] text-[#8A97A0] mt-0.5">
            {actividades.length} actividades registradas
          </p>
        </div>
        <Link
          href="/admin/actividades/nueva"
          className="bg-[#1B4C6E] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#163F5C] transition"
        >
          + Nueva actividad
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {actividades.map((a) => (
          <div
            key={a.id}
            className={`grid grid-cols-[64px_1fr_auto_auto] items-center gap-3.5 border border-[#E4E9ED] rounded-xl p-3 ${
              !a.publicada ? "opacity-60" : ""
            }`}
          >
            <div
              style={{ background: a.colorCover }}
              className="w-16 h-12 rounded-md"
            />

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-medium text-[13.5px] text-[#1B4C6E]">
                  {a.titulo}
                </span>
                <span
                  style={{
                    background: categoriaColores[a.categoria].bg,
                    color: categoriaColores[a.categoria].text,
                  }}
                  className="text-[10.5px] px-2 py-0.5 rounded-full"
                >
                  {a.categoria}
                </span>
              </div>
              <span className="text-xs text-[#8A97A0]">
                {a.fecha} · Publicado por {a.publicadoPor}
              </span>
            </div>

            <button
              onClick={() => togglePublicada(a.id)}
              style={
                a.publicada
                  ? { background: "#E9F7EC", color: "#2C7A3F" }
                  : { background: "#F1EFE8", color: "#5F5E5A" }
              }
              className="text-[11px] px-2.5 py-1.5 rounded-full whitespace-nowrap"
            >
              {a.publicada ? "● Publicada" : "○ Oculta"}
            </button>

            <div className="flex gap-3 text-xs">
              <Link
                href={`/admin/actividades/${a.id}/editar`}
                className="text-[#1B4C6E] hover:underline"
              >
                Editar
              </Link>
              <button
                onClick={() => eliminarActividad(a.id)}
                className="text-[#B14A3B] hover:underline"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}