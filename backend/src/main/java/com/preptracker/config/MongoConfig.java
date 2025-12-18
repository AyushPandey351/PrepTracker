package com.preptracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Configuration
@EnableMongoAuditing
public class MongoConfig {
    // MongoDB auditing configuration
    // This enables @CreatedDate, @LastModifiedDate annotations if needed
}

