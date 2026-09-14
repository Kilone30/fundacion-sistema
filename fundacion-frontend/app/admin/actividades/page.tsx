"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Actividad {
  id: number;
  titulo: string;
  categoriaNombre: string | null;
  fecha: string;
  publicadoPorNombre: string;
  publicado: boolean;
}

const categoriaColores: Record<string, { bg: string; text: string }> = {
  "Medio ambiente": { bg: "#E9F7EC", text: "#2C7A3F" },
  "Educación": { bg: "#FDEDEC", text: "#B14A3B" },
  "Comunidad": { bg: "#FFF3E0", text: "#B36A00" },
};

export default function ActividadesAdminPage() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [cargando, setCargando] = useState(true);

  function cargarActividades() {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/actividades", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setActividades(data))
      .catch((err) => console.error("Error cargando actividades:", err))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargarActividades();
  }, []);

  function togglePublicada(id: number) {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/api/actividades/${id}/publicar`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => cargarActividades())
      .catch((err) => console.error("Error al cambiar estado:", err));
  }

  function eliminarActividad(id: number, titulo: string) {
    const confirmar = window.confirm(
      `¿Eliminar "${titulo}"? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/api/actividades/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => cargarActividades())
      .catch((err) => console.error("Error al eliminar:", err));
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

      {cargando && <p className="text-sm text-[#8A97A0]">Cargando...</p>}

      {!cargando && actividades.length === 0 && (
        <p className="text-sm text-[#8A97A0]">Todavía no hay actividades registradas.</p>
      )}

      <div className="flex flex-col gap-3">
        {actividades.map((a) => {
          const colores = a.categoriaNombre
            ? categoriaColores[a.categoriaNombre] ?? { bg: "#F1EFE8", text: "#5F5E5A" }
            : { bg: "#F1EFE8", text: "#5F5E5A" };

          const fechaFormateada = new Date(a.fecha).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return (
            <div
              key={a.id}
              className={`grid grid-cols-[1fr_auto_auto] items-center gap-3.5 border border-[#E4E9ED] rounded-xl p-3 ${
                !a.publicado ? "opacity-60" : ""
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-[13.5px] text-[#1B4C6E]">
                    {a.titulo}
                  </span>
                  {a.categoriaNombre && (
                    <span
                      style={{ background: colores.bg, color: colores.text }}
                      className="text-[10.5px] px-2 py-0.5 rounded-full"
                    >
                      {a.categoriaNombre}
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#8A97A0]">
                  {fechaFormateada} · Publicado por {a.publicadoPorNombre}
                </span>
              </div>

              <button
                onClick={() => togglePublicada(a.id)}
                style={
                  a.publicado
                    ? { background: "#E9F7EC", color: "#2C7A3F" }
                    : { background: "#F1EFE8", color: "#5F5E5A" }
                }
                className="text-[11px] px-2.5 py-1.5 rounded-full whitespace-nowrap"
              >
                {a.publicado ? "● Publicada" : "○ Oculta"}
              </button>

              <div className="flex gap-3 text-xs">
                <button
                  onClick={() => eliminarActividad(a.id, a.titulo)}
                  className="text-[#B14A3B] hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}