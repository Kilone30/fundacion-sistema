package com.fundacion.backend.controller;

import com.fundacion.backend.dto.ActividadResponse;
import com.fundacion.backend.service.ActividadService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/actividades")
public class PublicActividadController {

    private final ActividadService actividadService;

    public PublicActividadController(ActividadService actividadService) {
        this.actividadService = actividadService;
    }

    @GetMapping
    public List<ActividadResponse> listar() {
        return actividadService.listarPublicadas();
    }
}