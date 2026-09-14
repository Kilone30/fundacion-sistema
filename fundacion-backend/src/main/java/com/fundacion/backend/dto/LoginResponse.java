package com.fundacion.backend.dto;

public record LoginResponse(String token, String nombre, String rol) {
}