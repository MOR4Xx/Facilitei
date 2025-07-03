// mor4xx/facilitei/Facilitei-d427a563d4621b17bc84b9d2a9232fff512c93a8/src/main/java/psg/facilitei/config/ModelMapperConfig.java
package psg.facilitei.Config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import psg.facilitei.DTO.ServicoRequestDTO;
import psg.facilitei.Entity.Servico;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // 🎯 Estratégia de mapeamento ESTRITA para evitar mapeamentos inesperados
        // Isso garante que apenas propriedades com nomes e tipos idênticos (ou mapeamentos explícitos)
        // sejam considerados, reduzindo ambiguidades.
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        // 📝 Configuração específica para mapear ServicoRequestDTO para Servico
        // Precisamos pular certos mapeamentos que o ModelMapper tenta fazer automaticamente
        // mas que são tratados manualmente no serviço para a criação e atualização de relacionamentos.
        modelMapper.createTypeMap(ServicoRequestDTO.class, Servico.class)
                .addMappings(mapper -> {
                    // 🚫 Pula o mapeamento de qualquer fonte para o 'id' do Serviço.
                    // O 'id' é geralmente auto-gerado ou passado via PathVariable para atualizações.
                    mapper.skip(Servico::setId);

                    // 🚫 Pula o mapeamento de qualquer fonte para a entidade 'trabalhador'.
                    // A entidade 'Trabalhador' é buscada e definida manualmente no serviço usando o trabalhadorId.
                    mapper.skip(Servico::setTrabalhador);

                    // 🚫 Pula o mapeamento de qualquer fonte para a entidade 'cliente'.
                    // A entidade 'Cliente' é buscada e definida manualmente no serviço usando o clienteId.
                    mapper.skip(Servico::setCliente);
                });

        return modelMapper;
    }
}