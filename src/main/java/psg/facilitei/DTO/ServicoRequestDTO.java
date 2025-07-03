// mor4xx/facilitei/Facilitei-d427a563d4621b17bc84b9d2a9232fff512c93a8/src/main/java/psg/facilitei/DTO/ServicoRequestDTO.java
package psg.facilitei.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import psg.facilitei.Entity.Enum.TipoServico;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO para requisição de criação/atualização de Serviço")
public class ServicoRequestDTO {

    @NotBlank(message = "O título do serviço é obrigatório.")
    @Size(max = 100, message = "O título do serviço deve ter no máximo 100 caracteres.")
    @Schema(description = "Título do serviço a ser cadastrado", example = "Instalação de Ar Condicionado")
    private String titulo;

    @NotBlank(message = "A descrição do serviço é obrigatória.")
    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres.")
    @Schema(description = "Descrição detalhada do serviço", example = "Instalação profissional de ar condicionado split e janela.")
    private String descricao;

    @NotNull(message = "O preço do serviço é obrigatório.")
    @Positive(message = "O preço deve ser um valor positivo.")
    @Schema(description = "Preço sugerido para o serviço", example = "250.00")
    private Double preco;

    @NotNull(message = "O ID do trabalhador é obrigatório.")
    @Schema(description = "ID do trabalhador que oferece o serviço", example = "1")
    private Long trabalhadorId;

    @NotNull(message = "O tipo de serviço é obrigatório.")
    @Schema(description = "Tipo de serviço oferecido (Enum)", example = "INSTALADOR_AR_CONDICIONADO")
    private TipoServico tipoServico;

    @NotNull(message = "O ID do cliente é obrigatório.")
    @Schema(description = "ID do cliente solicitante do serviço", example = "2")
    private Long clienteId;

    @NotNull(message = "O ID da disponibilidade é obrigatório.") 
    @Schema(description = "ID da disponibilidade associada ao serviço", example = "1")
    private Long disponibilidadeId;
}