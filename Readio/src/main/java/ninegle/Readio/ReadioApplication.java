package ninegle.Readio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ReadioApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReadioApplication.class, args);
	}

}
