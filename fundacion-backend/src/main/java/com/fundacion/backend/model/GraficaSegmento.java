package com.fundacion.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "grafica_segmentos")
@Getter
@Setter
@NoArgsConstructor
public class GraficaSegmento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grafica_id", nullable = false)
    private Grafica grafica;

    @Column(nullable = false, length = 100)
    private String etiqueta;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;
}