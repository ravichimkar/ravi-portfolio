package dev.ravichimkar.portfolio;
import dev.ravichimkar.portfolio.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class PortfolioApplication { public static void main(String[] args){SpringApplication.run(PortfolioApplication.class,args);} }
