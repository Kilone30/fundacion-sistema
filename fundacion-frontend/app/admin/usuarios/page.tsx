"use client";

import { useState } from "react";

type Rol = "Superusuario" | "Editor" | "Colaborador";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  creado: string;
}

const rolColores: Record<Rol, { bg: string; text: string }> = {
  Superusuario: { bg: "#FDEDEC", text: "#B14A3B" },
  Editor: { bg: "#E9F7EC", text: "#2C7A3F" },
  Colaborador: { bg: "#FFF3E0", text: "#B36A00" },
};

const usuariosIniciales: Usuario[] = [
  { id: 1, nombre: "Guillermina Pérez", email: "guillermina@fundacion.org", rol: "Superusuario", creado: "03 sep" },
  { id: 2, nombre: "Jorge Pérez", email: "jorge@fundacion.org", rol: "Editor", creado: "01 sep" },
  { id: 3, nombre: "Ana López", email: "ana@fundacion.org", rol: "Colaborador", creado: "28 ago" },
];

function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ModalNuevoUsuario({
  onClose,
  onCrear,
}: {
  onClose: () => void;
  onCrear: (u: Omit<Usuario, "id" | "creado">) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<Rol>("Colaborador");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre || !email || !password) {
      setError("Completa todos los campos.");
      return;
    }
    onCrear({ nombre, email, rol });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h2 className="font-semibold text-lg text-[#1B4C6E] mb-4">
          Nuevo usuario
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm text-[#1B4C6E] mb-1.5">Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre completo"
            className="w-full h-10 px-3 mb-3 border border-[#D5DEE4] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3DAA57]"
          />

          <label className="block text-sm text-[#1B4C6E] mb-1.5">Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nombre@fundacion.org"
            className="w-full h-10 px-3 mb-3 border border-[#D5DEE4] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3DAA57]"
          />

          <label className="block text-sm text-[#1B4C6E] mb-1.5">Contraseña temporal</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-10 px-3 mb-3 border border-[#D5DEE4] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3DAA57]"
          />

          <label className="block text-sm text-[#1B4C6E] mb-1.5">Rol</label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value as Rol)}
            className="w-full h-10 px-3 mb-4 border border-[#D5DEE4] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3DAA57]"
          >
            <option value="Colaborador">Colaborador</option>
            <option value="Editor">Editor</option>
            <option value="Superusuario">Superusuario</option>
          </select>

          {error && <p className="text-sm text-red-700 mb-3">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 border border-[#D5DEE4] rounded-md text-sm text-[#1B4C6E]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 h-10 bg-[#1B4C6E] text-white rounded-md text-sm font-medium hover:bg-[#163F5C] transition"
            >
              Crear usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciales);
  const [modalAbierto, setModalAbierto] = useState(false);

  function crearUsuario(nuevo: Omit<Usuario, "id" | "creado">) {
    setUsuarios((prev) => [
      ...prev,
      {
        ...nuevo,
        id: prev.length + 1,
        creado: new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short" }),
      },
    ]);
  }

  function eliminarUsuario(id: number) {
    const usuario = usuarios.find((u) => u.id === id);
    if (!usuario) return;
    const confirmar = window.confirm(`¿Eliminar a ${usuario.nombre}? Esta acción no se puede deshacer.`);
    if (confirmar) {
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-semibold text-xl text-[#1B4C6E]">Usuarios</h1>
          <p className="text-[12.5px] text-[#8A97A0] mt-0.5">
            {usuarios.length} usuarios registrados
          </p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-[#1B4C6E] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#163F5C] transition"
        >
          + Nuevo usuario
        </button>
      </div>

      <div className="border border-[#E4E9ED] rounded-xl overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_1.2fr_1fr_0.6fr] bg-[#F7F9FA] px-4 py-2.5 text-[11.5px] text-[#8A97A0] font-medium">
          <span>Nombre</span>
          <span>Correo</span>
          <span>Rol</span>
          <span>Creado</span>
          <span></span>
        </div>

        {usuarios.map((u) => (
          <div
            key={u.id}
            className="grid grid-cols-[2fr_2fr_1.2fr_1fr_0.6fr] items-center px-4 py-3 border-t border-[#EDF0F2] text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                style={{ background: rolColores[u.rol].bg, color: rolColores[u.rol].text }}
                className="w-\[26px] h-\[26px] rounded-full flex items-center justify-center text-[11px] font-semibold"
              >
                {iniciales(u.nombre)}
              </div>
              {u.nombre}
            </div>
            <span className="text-[#5A6772]">{u.email}</span>
            <span
              style={{ background: rolColores[u.rol].bg, color: rolColores[u.rol].text }}
              className="text-[11px] px-2.5 py-1 rounded-full w-fit"
            >
              {u.rol}
            </span>
            <span className="text-[#8A97A0] text-xs">{u.creado}</span>
            <button
              onClick={() => eliminarUsuario(u.id)}
              className="text-[#B14A3B] text-xs hover:underline text-left"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {modalAbierto && (
        <ModalNuevoUsuario
          onClose={() => setModalAbierto(false)}
          onCrear={crearUsuario}
        />
      )}
    </div>
  );
}