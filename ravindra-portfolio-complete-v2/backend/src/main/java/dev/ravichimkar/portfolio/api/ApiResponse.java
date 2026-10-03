package dev.ravichimkar.portfolio.api;
public record ApiResponse<T>(boolean success,T data,String message){public static<T>ApiResponse<T>ok(T d){return new ApiResponse<>(true,d,null);}public static<T>ApiResponse<T>error(String m){return new ApiResponse<>(false,null,m);}}
