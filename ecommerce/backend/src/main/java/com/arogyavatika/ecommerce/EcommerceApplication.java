package com.arogyavatika.ecommerce;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class EcommerceApplication {

	public static void main(String[] args) {

       // Dotenv dotenv = Dotenv.load(); for production
        String mongoUri = System.getenv("MONGO_URI");
        String db = System.getenv("DB");
        String port = System.getenv().getOrDefault("PORT", "8080");
        String frontendUrl = System.getenv("FRONTEND");

        System.setProperty("MONGO_URI", mongoUri);
        System.setProperty("DB", db);
        System.setProperty("server.port", port);
        System.setProperty("frontend.url", frontendUrl);

        SpringApplication.run(EcommerceApplication.class, args);
	}


    @Bean
    MongoTransactionManager transactionManager(MongoDatabaseFactory dbFactory) {
        return new MongoTransactionManager(dbFactory);
    }

}
