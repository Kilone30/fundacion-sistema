"use client";

import { useState } from "react";

interface Permiso {
  id: string;
  label: string;
  categoria: "Actividades" | "Usuarios" | "Gráficas";
}

interface Rol {
  id: number;
  nombre: string;
  fijo: boolean; // true solo para Superusuario: no editable, no eliminable
  permisos: string[]; // ids de permisos activos
}

const todosLosPermisos: Permiso[] = [
  { id: "crear_actividades", label: "Crear actividades", categoria: "Actividades" },
  { id: "editar_actividades", label: "Editar actividades", categoria: "Actividades" },
  { id: "eliminar_actividades", label: "Eliminar actividades", categoria: "Actividades" },
  { id: "publicar_actividades", label: "Publicar/ocultar actividades", categoria: "Actividades" },
  { id: "crear_usuarios", label: "Crear usuarios", categoria: "Usuarios" },
  { id: "gestionar_roles", label: "Gestionar roles y permisos", categoria: "Usuarios" },
  { id: "crear_graficas", label: "Crear gráficas", categoria: "Gráficas" },
];

const rolesIniciales: Rol[] = [
  {
    id: 1,
    nombre: "Superusuario",
    fijo: true,
    permisos: todosLosPermisos.map((p) => p.id), // siempre tiene todos
  },
  {
    id: 2,
    nombre: "Editor",
    fijo: false,
    permisos: ["crear_actividades", "editar_actividades", "publicar_actividades", "crear_graficas"],
  },
  {
    id: 3,
    nombre: "Colaborador",
    fijo: false,
    permisos: ["crear_actividades"],
  },
];

const categorias: Permiso["categoria"][] = ["Actividades", "Usuarios", "Gráficas"];

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>(rolesIniciales);
  const [rolSeleccionadoId, setRolSeleccionadoId] = useState(2);

  const rolSeleccionado = roles.find((r) => r.id === rolSeleccionadoId)!;

  function togglePermiso(permisoId: string) {
    if (rolSeleccionado.fijo) return; // Superusuario no se toca

    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== rolSeleccionadoId) return r;
        const tienePermiso = r.permisos.includes(permisoId);
        return {
          ...r,
          permisos: tienePermiso
            ? r.permisos.filter((p) => p !== permisoId)
            : [...r.permisos, permisoId],
        };
      })
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-semibold text-xl text-[#1B4C6E]">Roles y permisos</h1>
        <button className="bg-[#1B4C6E] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#163F5C] transition">
          + Nuevo rol
        </button>
      </div>

      <div className="grid grid-cols-[150px_1fr] gap-6">
        <div className="flex flex-col gap-1.5">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setRolSeleccionadoId(r.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium text-left border transition ${
                r.id === rolSeleccionadoId
                  ? "bg-[#EAF4FA] border-[#3DAA57] text-[#1B4C6E]"
                  : "bg-[#F7F9FA] border-[#E4E9ED] text-[#1B4C6E]"
              }`}
            >
              {r.nombre}
              {r.fijo && (
                <span className="block text-[10px] text-[#8A97A0] font-normal">
                  Rol fijo
                </span>
              )}
            </button>
          ))}
        </div>

        <div>
          <p className="text-xs text-[#8A97A0] mb-3">
            Permisos del rol <strong className="text-[#1B4C6E]">{rolSeleccionado.nombre}</strong>
            {rolSeleccionado.fijo && " · Este rol siempre tiene todos los permisos"}
          </p>

          {categorias.map((cat) => (
            <div key={cat} className="mb-4">
              <p className="text-[11.5px] text-[#8A97A0] font-medium mb-1.5">{cat}</p>
              <div className="flex flex-col gap-2">
                {todosLosPermisos
                  .filter((p) => p.categoria === cat)
                  .map((p) => {
                    const activo = rolSeleccionado.permisos.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={`flex items-center gap-2.5 text-sm ${
                          rolSeleccionado.fijo ? "cursor-not-allowed" : "cursor-pointer"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={activo}
                          disabled={rolSeleccionado.fijo}
                          onChange={() => togglePermiso(p.id)}
                          className="w-4 h-4 accent-[#3DAA57]"
                        />
                        <span className={activo ? "text-[#2B2A25]" : "text-[#B5BEC4]"}>
                          {p.label}
                        </span>
                      </label>
                    );
                  })}
              </div>
            </div>
          ))}

          {!rolSeleccionado.fijo && (
            <button className="bg-[#1B4C6E] text-white px-4.5 py-2 rounded-md text-sm font-medium hover:bg-[#163F5C] transition mt-2">
              Guardar cambios
            </button>
          )}
        </div>
      </div>
    </div>
  );
}