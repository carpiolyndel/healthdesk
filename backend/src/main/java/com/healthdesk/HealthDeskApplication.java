package main.java.com.healthdesk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HealthDeskApplication {
    public static void main(String[] args) {
        SpringApplication.run(HealthDeskApplication.class, args);
        System.out.println("HealthDesk Backend Running on port 8080");
    }
}