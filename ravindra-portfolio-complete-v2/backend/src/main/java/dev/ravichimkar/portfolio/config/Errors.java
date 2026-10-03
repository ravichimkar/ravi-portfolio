package dev.ravichimkar.portfolio.config;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import dev.ravichimkar.portfolio.api.ApiResponse;

@RestControllerAdvice
public class Errors {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ApiResponse<?> validation(MethodArgumentNotValidException e) {
        e.printStackTrace();
        return ApiResponse.error("Validation failed: " + e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    ApiResponse<?> error(Exception e) {

        e.printStackTrace();

        return ApiResponse.error(
            e.getMessage() != null
                ? e.getMessage()
                : "Unexpected server error"
        );
    }
}