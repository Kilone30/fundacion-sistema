package com.fundacion.backend.repository;

import com.fundacion.backend.model.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActividadRepository extends JpaRepository<Actividad, Long> {
    List<Actividad> findByPublicadoTrue();
}