"use client";

import { useInView } from "@/hooks/useInView";

const actividades = [
  {
    categoria: "Medio ambiente",
    colorBg: "#E9F7EC",
    colorText: "#2C7A3F",
    fecha: "15 sep 2026",
    titulo: "Jornada de reforestación en el Parque Bicentenario",
    descripcion:
      "Sembramos 200 árboles junto con voluntarios de la comunidad, dejando algo verde para el futuro de Toluca.",
  },
  {
    categoria: "Educación",
    colorBg: "#FDEDEC",
    colorText: "#B14A3B",
    fecha: "2 sep 2026",
    titulo: "Taller de repostería inclusivo",
    descripcion:
      "Entre azúcar y risas, compartimos clases de repostería con niños de la comunidad porque cada pastelito es una oportunidad de crear.",
  },
];

function ActividadCard({ actividad }: { actividad: (typeof actividades)[0] }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`au-reveal ${inView ? "au-visible" : ""} border border-[#E4E9ED] rounded-xl p-6 bg-[#FBFCFD]`}
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <span
          style={{ background: actividad.colorBg, color: actividad.colorText }}
          className="text-[11px] px-2.5 py-1 rounded-full font-medium"
        >
          {actividad.categoria}
        </span>
        <span className="text-[12.5px] text-[#8A97A0]">{actividad.fecha}</span>
      </div>
      <h2 className="font-semibold text-lg text-[#1B4C6E] mb-2">
        {actividad.titulo}
      </h2>
      <p className="text-[13.5px] text-[#5A6772] leading-relaxed max-w-xl">
        {actividad.descripcion}
      </p>
    </div>
  );
}

function PatronLateral({ lado }: { lado: "left" | "right" }) {
  const puntos = [
    { x: 20, y: 60, delay: "0s", color: "#F2A93E", r: 4 },
    { x: 55, y: 140, delay: "1.2s", color: "#E8734A", r: 3 },
    { x: 15, y: 230, delay: "2s", color: "#F2A93E", r: 3.5 },
    { x: 60, y: 320, delay: "0.6s", color: "#E8734A", r: 4 },
    { x: 25, y: 410, delay: "1.8s", color: "#F2A93E", r: 3 },
  ];

  return (
    <div
      className={`hidden lg:block fixed top-0 ${lado === "left" ? "left-0" : "right-0"} h-full w-24 pointer-events-none z-0`}
    >
      <svg width="100%" height="100%" viewBox="0 0 80 500">
        {puntos.slice(0, -1).map((p, i) => (
          <line
            key={i}
            x1={p.x}
            y1={p.y}
            x2={puntos[i + 1].x}
            y2={puntos[i + 1].y}
            stroke="#1B4C6E"
            strokeWidth="0.5"
            opacity="0.15"
          />
        ))}
        {puntos.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={p.color}
            className="au-dot"
            style={{ animationDelay: p.delay }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function ActividadesPage() {
  return (
    <div className="relative min-h-screen bg-white">
      <PatronLateral lado="left" />
      <PatronLateral lado="right" />

      <nav className="bg-[#1B4C6E] px-8 py-3.5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#3DAA57] flex items-center justify-center text-white text-sm font-semibold">
            F
          </div>
          <span className="text-white text-sm font-medium">
            Fundación Manos Unidas
          </span>
        </div>
        <div className="flex gap-6 text-sm">
          <span className="text-white">Inicio</span>
          <span className="text-[#9FC1D6]">Actividades</span>
          <span className="text-[#9FC1D6]">Quiénes somos</span>
          <span className="text-[#9FC1D6]">Contacto</span>
        </div>
      </nav>

      <div className="text-center py-12 px-8 relative z-10">
        <h1 className="text-[26px] font-semibold text-[#1B4C6E] mb-1.5">
          Actividades de la fundación
        </h1>
        <p className="text-sm text-[#4A7C9B]">
          Cada historia, un paso hacia una comunidad más incluyente
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-8 pb-16 flex flex-col gap-8 relative z-10">
        {actividades.map((actividad, i) => (
          <ActividadCard key={i} actividad={actividad} />
        ))}
      </div>
    </div>
  );
}