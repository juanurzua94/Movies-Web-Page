package com.movies.css122bspring20api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class Css122bSpring20apiApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(Css122bSpring20apiApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder){
        return builder.sources(Css122bSpring20apiApplication.class);
    }

}
