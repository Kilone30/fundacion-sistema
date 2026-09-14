"use client";

import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboard() {
  const { sesion, cargando, cerrarSesion } = useAuth();

  if (cargando || !sesion) {
    return null;
  }

  return (
    <div>
      <h1 className="font-semibold text-xl text-[#1B4C6E] mb-1">
        Hola, {sesion.nombre.split(" ")[0]}
      </h1>
      <p className="text-sm text-[#8A97A0] mb-6">
        Sesión iniciada como <strong className="text-[#5A6772]">{sesion.rol}</strong>
      </p>

      <p className="text-sm text-[#5A6772] mb-6">
        Selecciona una sección del menú lateral para comenzar.
      </p>

      <button
        onClick={cerrarSesion}
        className="text-sm text-[#B14A3B] hover:underline"
      >
        Cerrar sesión
      </button>
    </div>
  );
}