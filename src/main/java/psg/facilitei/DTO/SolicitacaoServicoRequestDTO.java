package psg.facilitei.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import psg.facilitei.Entity.Enum.StatusSolicitacao;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(description = "DTO para requisição de criação/atualização de Solicitação de Serviço")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitacaoServicoRequestDTO {

    @NotNull(message = "O ID do cliente é obrigatório.")
    @Schema(description = "ID do cliente que está solicitando o serviço", example = "2")
    private Long clienteId;

    @NotNull(message = "O ID do serviço é obrigatório.")
    @Schema(description = "ID do serviço que está sendo solicitado", example = "10")
    private Long servicoId;

    @NotBlank(message = "A descrição da solicitação é obrigatória.")
    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres.")
    @Schema(description = "Descrição detalhada da solicitação do serviço", example = "Preciso de um eletricista para instalar um chuveiro novo.")
    private String descricao;

    private StatusSolicitacao statusSolicitacao;
}