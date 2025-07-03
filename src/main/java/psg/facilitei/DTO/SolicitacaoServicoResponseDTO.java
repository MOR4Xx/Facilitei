package psg.facilitei.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(description = "DTO para resposta de informações de Solicitação de Serviço")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitacaoServicoResponseDTO {
    @Schema(description = "ID único da solicitação de serviço", example = "5")
    private Long id;
    @Schema(description = "ID do cliente solicitante", example = "2")
    private Long clienteId;
    @Schema(description = "ID do serviço solicitado", example = "10")
    private Long servicoId;
    @Schema(description = "Descrição da solicitação", example = "Instalação de um novo chuveiro na residência.")
    private String descricao;
    @Schema(description = "Status atual da solicitação (PENDENTE, ACEITA, RECUSADA, etc.)", example = "PENDENTE")
    private String status;
}