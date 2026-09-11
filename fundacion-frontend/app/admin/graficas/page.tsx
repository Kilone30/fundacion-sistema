"use client";

import { useState } from "react";
import Link from "next/link";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Legend, Tooltip } from "recharts";

interface Segmento {
  etiqueta: string;
  valor: number;
}

interface Grafica {
  id: number;
  titulo: string;
  tipo: "pastel" | "barras";
  actividadRelacionada: string; // o "Estadística general"
  segmentos: Segmento[];
}

const coloresSegmento = ["#3DAA57", "#F2A93E", "#E8734A", "#1B4C6E", "#8A97A0"];

const graficasIniciales: Grafica[] = [
  {
    id: 1,
    titulo: "Asistencia por género",
    tipo: "pastel",
    actividadRelacionada: "Jornada de reforestación",
    segmentos: [
      { etiqueta: "Hombres", valor: 35 },
      { etiqueta: "Mujeres", valor: 42 },
    ],
  },
  {
    id: 2,
    titulo: "Presupuesto por rubro",
    tipo: "barras",
    actividadRelacionada: "Venta por una buena causa",
    segmentos: [
      { etiqueta: "Transporte", valor: 3200 },
      { etiqueta: "Comida", valor: 1800 },
      { etiqueta: "Materiales", valor: 950 },
      { etiqueta: "Publicidad", valor: 1200 },
    ],
  },
  {
    id: 3,
    titulo: "Actividades por trimestre",
    tipo: "pastel",
    actividadRelacionada: "Estadística general",
    segmentos: [
      { etiqueta: "Q1", valor: 5 },
      { etiqueta: "Q2", valor: 8 },
    ],
  },
];

function MiniPreview({ grafica }: { grafica: Grafica }) {
  if (grafica.tipo === "pastel") {
    return (
      <PieChart width={90} height={90}>
        <Pie data={grafica.segmentos} dataKey="valor" nameKey="etiqueta" outerRadius={40} innerRadius={22}>
          {grafica.segmentos.map((_, i) => (
            <Cell key={i} fill={coloresSegmento[i % coloresSegmento.length]} />
          ))}
        </Pie>
      </PieChart>
    );
  }
  return (
    <BarChart width={110} height={90} data={grafica.segmentos}>
      <Bar dataKey="valor" fill="#3DAA57" radius={[3, 3, 0, 0]} />
    </BarChart>
  );
}

function ModalDetalleGrafica({ grafica, onClose }: { grafica: Grafica; onClose: () => void }) {
  const total = grafica.segmentos.reduce((acc, s) => acc + s.valor, 0);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="font-semibold text-xl text-[#1B4C6E]">{grafica.titulo}</h2>
            <p className="text-[12.5px] text-[#8A97A0] mt-0.5">
              {grafica.actividadRelacionada}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#8A97A0] text-xl leading-none hover:text-[#1B4C6E]"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col items-center py-6">
          {grafica.tipo === "pastel" ? (
            <PieChart width={260} height={220}>
              <Pie
                data={grafica.segmentos}
                dataKey="valor"
                nameKey="etiqueta"
                outerRadius={85}
                innerRadius={48}
              >
                {grafica.segmentos.map((_, i) => (
                  <Cell key={i} fill={coloresSegmento[i % coloresSegmento.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          ) : (
            <BarChart width={320} height={220} data={grafica.segmentos}>
              <XAxis dataKey="etiqueta" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="valor" fill="#3DAA57" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </div>

        <div className="border border-[#E4E9ED] rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 bg-[#F7F9FA] px-4 py-2 text-[11.5px] text-[#8A97A0] font-medium">
            <span>Segmento</span>
            <span className="text-right">Valor</span>
          </div>
          {grafica.segmentos.map((s, i) => (
            <div
              key={i}
              className="grid grid-cols-2 px-4 py-2 border-t border-[#EDF0F2] text-sm items-center"
            >
              <span className="flex items-center gap-2">
                <span
                  style={{ background: coloresSegmento[i % coloresSegmento.length] }}
                  className="w-2 h-2 rounded-sm"
                />
                {s.etiqueta}
              </span>
              <span className="text-right text-[#5A6772]">{s.valor.toLocaleString()}</span>
            </div>
          ))}
          <div className="grid grid-cols-2 px-4 py-2 border-t border-[#E4E9ED] text-sm font-medium">
            <span className="text-[#1B4C6E]">Total</span>
            <span className="text-right text-[#1B4C6E]">{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-2.5 mt-5">
          <button
            onClick={onClose}
            className="flex-1 h-10 border border-[#D5DEE4] rounded-md text-sm text-[#1B4C6E]"
          >
            Cerrar
          </button>
          <button className="flex-1 h-10 bg-[#1B4C6E] text-white rounded-md text-sm font-medium hover:bg-[#163F5C] transition">
            Editar gráfica
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GraficasPage() {
  const [graficas] = useState<Grafica[]>(graficasIniciales);
  const [graficaSeleccionada, setGraficaSeleccionada] = useState<Grafica | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-semibold text-xl text-[#1B4C6E]">Gráficas</h1>
          <p className="text-[12.5px] text-[#8A97A0] mt-0.5">
            {graficas.length} gráficas creadas
          </p>
        </div>
        <Link
          href="/admin/graficas/nueva"
          className="bg-[#1B4C6E] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#163F5C] transition"
        >
          + Nueva gráfica
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3.5">
        {graficas.map((g) => (
          <button
            key={g.id}
            onClick={() => setGraficaSeleccionada(g)}
            className="border border-[#E4E9ED] rounded-xl p-4 text-left hover:border-[#3DAA57] transition"
          >
            <div className="flex items-center justify-center mb-2.5">
              <MiniPreview grafica={g} />
            </div>
            <p className="font-medium text-sm text-[#1B4C6E]">{g.titulo}</p>
            <p className="text-[11.5px] text-[#8A97A0]">{g.actividadRelacionada}</p>
          </button>
        ))}
      </div>

      {graficaSeleccionada && (
        <ModalDetalleGrafica
          grafica={graficaSeleccionada}
          onClose={() => setGraficaSeleccionada(null)}
        />
      )}
    </div>
  );
}