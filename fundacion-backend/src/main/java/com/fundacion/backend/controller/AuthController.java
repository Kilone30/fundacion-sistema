package com.fundacion.backend.controller;

import com.fundacion.backend.dto.LoginRequest;
import com.fundacion.backend.dto.LoginResponse;
import com.fundacion.backend.model.Usuario;
import com.fundacion.backend.repository.UsuarioRepository;
import com.fundacion.backend.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.usuario(), request.password())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
        }

        Usuario usuario = usuarioRepository.findByEmail(request.usuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(usuario.getEmail())
                .password(usuario.getPasswordHash())
                .authorities("ROLE_" + usuario.getRol().getNombre().toUpperCase())
                .build();

        String token = jwtService.generarToken(userDetails);

        return ResponseEntity.ok(new LoginResponse(token, usuario.getNombre(), usuario.getRol().getNombre()));
    }
}