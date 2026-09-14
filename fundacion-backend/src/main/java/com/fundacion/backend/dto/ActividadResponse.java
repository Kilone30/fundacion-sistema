package com.fundacion.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ActividadResponse(
        Long id,
        String titulo,
        String descripcion,
        LocalDate fecha,
        String categoriaNombre,
        String publicadoPorNombre,
        boolean publicado,
        LocalDateTime createdAt
) {}