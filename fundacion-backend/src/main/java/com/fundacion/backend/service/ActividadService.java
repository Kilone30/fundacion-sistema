package com.fundacion.backend.service;

import com.fundacion.backend.dto.ActividadRequest;
import com.fundacion.backend.dto.ActividadResponse;
import com.fundacion.backend.model.Actividad;
import com.fundacion.backend.model.Categoria;
import com.fundacion.backend.model.Usuario;
import com.fundacion.backend.repository.ActividadRepository;
import com.fundacion.backend.repository.CategoriaRepository;
import com.fundacion.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActividadService {

    private final ActividadRepository actividadRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;

    public ActividadService(
            ActividadRepository actividadRepository,
            CategoriaRepository categoriaRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.actividadRepository = actividadRepository;
        this.categoriaRepository = categoriaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<ActividadResponse> listarPublicadas() {
        return actividadRepository.findByPublicadoTrue()
                .stream()
                .map(this::aResponse)
                .toList();
    }

    public List<ActividadResponse> listarTodas() {
        return actividadRepository.findAll()
                .stream()
                .map(this::aResponse)
                .toList();
    }

    public ActividadResponse crear(ActividadRequest request, String emailUsuarioActual) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuarioActual)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Actividad actividad = new Actividad();
        actividad.setTitulo(request.titulo());
        actividad.setDescripcion(request.descripcion());
        actividad.setFecha(request.fecha());
        actividad.setPublicado(request.publicado());
        actividad.setUsuario(usuario);

        if (request.categoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(request.categoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            actividad.setCategoria(categoria);
        }

        Actividad guardada = actividadRepository.save(actividad);
        return aResponse(guardada);
    }

    public ActividadResponse actualizar(Long id, ActividadRequest request) {
        Actividad actividad = actividadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));

        actividad.setTitulo(request.titulo());
        actividad.setDescripcion(request.descripcion());
        actividad.setFecha(request.fecha());
        actividad.setPublicado(request.publicado());

        if (request.categoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(request.categoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            actividad.setCategoria(categoria);
        }

        return aResponse(actividadRepository.save(actividad));
    }

    public ActividadResponse togglePublicado(Long id) {
        Actividad actividad = actividadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Actividad no encontrada"));
        actividad.setPublicado(!actividad.isPublicado());
        return aResponse(actividadRepository.save(actividad));
    }

    public void eliminar(Long id) {
        if (!actividadRepository.existsById(id)) {
            throw new RuntimeException("Actividad no encontrada");
        }
        actividadRepository.deleteById(id);
    }

    private ActividadResponse aResponse(Actividad actividad) {
        return new ActividadResponse(
                actividad.getId(),
                actividad.getTitulo(),
                actividad.getDescripcion(),
                actividad.getFecha(),
                actividad.getCategoria() != null ? actividad.getCategoria().getNombre() : null,
                actividad.getUsuario().getNombre(),
                actividad.isPublicado(),
                actividad.getCreatedAt()
        );
    }
}