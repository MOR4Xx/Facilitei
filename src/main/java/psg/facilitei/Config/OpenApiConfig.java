package psg.facilitei.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API FACILITEI")
                        .version("v1")
                        .description("API example about Person")
                        .termsOfService("https://ifgoiano.urt.gov/projetos")
                        .license(
                                new License()
                                        .name("Apache 2.0")
                                        .url("https://ifgoiano.urt.gov/projetos")));
    }
}
