"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/actividades", label: "Actividades" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/roles", label: "Roles y permisos" },
  { href: "/admin/graficas", label: "Gráficas" },
];

// Esto luego vendrá del login real (contexto de sesión), por ahora es de ejemplo
const usuarioActual = { nombre: "Guillermina Pérez", rol: "Superusuario" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen grid grid-cols-[200px_1fr]">
      <aside className="bg-[#1B4C6E] p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-[26px] h-[26px] rounded-full bg-[#3DAA57] flex items-center justify-center text-white text-xs font-semibold">
            F
          </div>
          <span className="text-white text-[13px] font-medium">Panel admin</span>
        </div>

        {navItems.map((item) => {
          const activo = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                activo
                  ? "bg-white/10 text-white font-medium"
                  : "text-[#9FC1D6] hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </aside>

      <div className="flex flex-col">
        <header className="h-14 border-b border-[#E4E9ED] flex items-center justify-end px-6 gap-2.5">
          <div className="text-right">
            <p className="text-[13px] text-[#1B4C6E] font-medium leading-tight">
              {usuarioActual.nombre}
            </p>
            <p className="text-[11px] text-[#8A97A0] leading-tight">
              {usuarioActual.rol}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#E9F7EC] text-[#2C7A3F] flex items-center justify-center text-xs font-semibold">
            {usuarioActual.nombre
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </div>
        </header>

        <main className="p-8 bg-white flex-1">{children}</main>
      </div>
    </div>
  );
}