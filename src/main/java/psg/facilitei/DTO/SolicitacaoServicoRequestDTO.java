package psg.facilitei.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import psg.facilitei.Entity.Enum.StatusSolicitacao;
import psg.facilitei.Entity.Enum.TipoServico;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(description = "DTO para requisição de criação de Solicitação de Serviço")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitacaoServicoRequestDTO {

    @NotNull(message = "O ID do cliente é obrigatório.")
    private Long clienteId;

    @NotNull(message = "O ID do trabalhador é obrigatório.")
    private Long trabalhadorId;

    @NotNull(message = "O tipo de serviço é obrigatório.")
    private TipoServico tipoServico;

    @NotBlank(message = "A descrição da solicitação é obrigatória.")
    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres.")
    private String descricao;

    private StatusSolicitacao statusSolicitacao;
}