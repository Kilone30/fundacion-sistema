"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function PatronAnimado() {
  const puntos = [
    { x: 30, y: 60, delay: "0s", color: "#F2A93E", r: 4 },
    { x: 90, y: 40, delay: "1.2s", color: "#3DAA57", r: 3 },
    { x: 150, y: 90, delay: "2s", color: "#F2A93E", r: 3.5 },
    { x: 60, y: 150, delay: "0.6s", color: "#E8734A", r: 4 },
    { x: 130, y: 170, delay: "1.8s", color: "#3DAA57", r: 3 },
    { x: 40, y: 230, delay: "0.3s", color: "#F2A93E", r: 3.5 },
    { x: 110, y: 250, delay: "1.5s", color: "#E8734A", r: 3 },
    { x: 170, y: 210, delay: "0.9s", color: "#3DAA57", r: 4 },
    { x: 80, y: 310, delay: "2.2s", color: "#F2A93E", r: 3 },
    { x: 150, y: 330, delay: "0.4s", color: "#3DAA57", r: 3.5 },
    { x: 30, y: 360, delay: "1.6s", color: "#E8734A", r: 3 },
  ];
  const lineas = [
    { par: [0, 1], delay: "0s" },
    { par: [1, 2], delay: "0.7s" },
    { par: [3, 1], delay: "1.4s" },
    { par: [3, 4], delay: "0.3s" },
    { par: [4, 2], delay: "2.1s" },
    { par: [5, 3], delay: "1s" },
    { par: [5, 6], delay: "1.8s" },
    { par: [6, 7], delay: "0.5s" },
    { par: [6, 8], delay: "2.4s" },
    { par: [8, 9], delay: "0.9s" },
    { par: [8, 10], delay: "1.6s" },
  ];

  // Encoge la línea hacia su punto medio. factor 1 = tamaño completo, 0.4 = 40% del largo original
  function acortarLinea(x1: number, y1: number, x2: number, y2: number, factor: number) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return {
      x1: mx + (x1 - mx) * factor,
      y1: my + (y1 - my) * factor,
      x2: mx + (x2 - mx) * factor,
      y2: my + (y2 - my) * factor,
    };
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 200 400" style={{ position: "absolute", top: 0, left: 0 }} preserveAspectRatio="xMidYMid slice">
      {lineas.map((l, i) => {
        const p1 = puntos[l.par[0]];
        const p2 = puntos[l.par[1]];
        const corta = acortarLinea(p1.x, p1.y, p2.x, p2.y, 0.8);
        return (
          <line
            key={i}
            x1={corta.x1} y1={corta.y1}
            x2={corta.x2} y2={corta.y2}
            stroke="#EAF1F6" strokeWidth="0.6"
            className="au-line"
            style={{
              animationDelay: l.delay,
              animationDuration: `${3 + (i % 4)}s`,
            }}
          />
        );
      })}
      {puntos.map((p, i) => (
        <circle
          key={i}
          cx={p.x} cy={p.y} r={p.r}
          fill={p.color}
          className="au-dot"
          style={{ animationDelay: p.delay }}
        />
      ))}
    </svg>
  );
}

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!usuario || !password) {
      setError("Completa ambos campos.");
      return;
    }

    setCargando(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      if (!res.ok) {
        setError("Usuario o contraseña incorrectos.");
        return;
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("nombre", data.nombre);
      localStorage.setItem("rol", data.rol);

      router.push("/admin");
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[34%_66%]">
      <div className="hidden md:flex flex-col justify-between p-10 bg-[#1B4C6E] relative overflow-hidden">
        <PatronAnimado />
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#3DAA57] flex items-center justify-center text-white text-sm font-semibold">
            F
          </div>
          <div>
            <p className="font-semibold text-lg text-white leading-tight">
              Fundación
            </p>
            <p className="font-semibold text-lg text-white leading-tight">
              Manos Unidas
            </p>
          </div>
        </div>
        <p className="relative z-10 italic text-[15px] text-[#9FC1D6] leading-relaxed">
          Cada actividad registrada aquí es una historia de comunidad.
        </p>
      </div>

      <div className="flex items-center justify-center bg-white p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h1 className="font-semibold text-3xl text-[#1B4C6E] mb-1">
            Acceso interno
          </h1>
          <p className="text-sm text-[#5A6772] mb-8">
            Panel de administración de actividades
          </p>

          <label className="block text-sm text-[#1B4C6E] mb-1.5">
            Usuario
          </label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="nombre.usuario"
            className="w-full h-11 px-3 mb-4 border border-[#D5DEE4] rounded-md bg-white text-sm text-[#1B4C6E] focus:outline-none focus:ring-2 focus:ring-[#3DAA57]"
          />

          <label className="block text-sm text-[#1B4C6E] mb-1.5">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-11 px-3 mb-6 border border-[#D5DEE4] rounded-md bg-white text-sm text-[#1B4C6E] focus:outline-none focus:ring-2 focus:ring-[#3DAA57]"
          />

          {error && <p className="text-sm text-red-700 mb-4">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full h-11 bg-[#1B4C6E] text-white font-medium rounded-md hover:bg-[#163F5C] disabled:opacity-60 transition"
          >
            {cargando ? "Entrando..." : "Iniciar sesión"}
          </button>

          <p className="text-xs text-center text-[#8A97A0] mt-6">
            Acceso restringido a personal autorizado de la fundación
          </p>
        </form>
      </div>
    </div>
  );
}