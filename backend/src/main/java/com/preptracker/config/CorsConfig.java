package com.preptracker.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins:http://localhost:3000,http://localhost:5173}")
    private String allowedOrigins;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        
        // Parse allowed origins from environment variable or use defaults
        List<String> origins = Arrays.asList(allowedOrigins.split(","));
        corsConfiguration.setAllowedOrigins(origins);
        
        // Also allow all origins in development (can be disabled in production)
        corsConfiguration.addAllowedOriginPattern("*");
        
        // Allow all common HTTP methods
        corsConfiguration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));
        
        // Allow common headers
        corsConfiguration.setAllowedHeaders(Arrays.asList(
                "Origin",
                "Content-Type",
                "Accept",
                "Authorization",
                "X-Requested-With",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));
        
        // Expose headers
        corsConfiguration.setExposedHeaders(List.of("Authorization"));
        
        // Allow credentials
        corsConfiguration.setAllowCredentials(true);
        
        // Cache preflight response for 1 hour
        corsConfiguration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", corsConfiguration);
        
        return new CorsFilter(source);
    }
}
