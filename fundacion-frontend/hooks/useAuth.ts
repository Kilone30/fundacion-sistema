"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Sesion {
  nombre: string;
  rol: string;
}

export function useAuth() {
  const router = useRouter();
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nombre = localStorage.getItem("nombre");
    const rol = localStorage.getItem("rol");

    if (!token || !nombre || !rol) {
      router.push("/login");
      return;
    }

    setSesion({ nombre, rol });
    setCargando(false);
  }, [router]);

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    localStorage.removeItem("rol");
    router.push("/login");
  }

  return { sesion, cargando, cerrarSesion };
}