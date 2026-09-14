package com.fundacion.backend.dto;

import java.time.LocalDate;

public record ActividadRequest(
        String titulo,
        String descripcion,
        LocalDate fecha,
        Long categoriaId,
        boolean publicado
) {}