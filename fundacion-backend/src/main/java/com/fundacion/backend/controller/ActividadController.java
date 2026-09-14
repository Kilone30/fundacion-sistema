package com.fundacion.backend.controller;

import com.fundacion.backend.dto.ActividadRequest;
import com.fundacion.backend.dto.ActividadResponse;
import com.fundacion.backend.service.ActividadService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actividades")
public class ActividadController {

    private final ActividadService actividadService;

    public ActividadController(ActividadService actividadService) {
        this.actividadService = actividadService;
    }

    @GetMapping
    public List<ActividadResponse> listarTodas() {
        return actividadService.listarTodas();
    }

    @PostMapping
    public ResponseEntity<ActividadResponse> crear(
            @RequestBody ActividadRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(actividadService.crear(request, email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActividadResponse> actualizar(
            @PathVariable Long id,
            @RequestBody ActividadRequest request
    ) {
        return ResponseEntity.ok(actividadService.actualizar(id, request));
    }

    @PatchMapping("/{id}/publicar")
    public ResponseEntity<ActividadResponse> togglePublicado(@PathVariable Long id) {
        return ResponseEntity.ok(actividadService.togglePublicado(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        actividadService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}