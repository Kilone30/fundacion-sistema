package com.fundacion.backend.repository;

import com.fundacion.backend.model.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermisoRepository extends JpaRepository<Permiso, Long> {
}