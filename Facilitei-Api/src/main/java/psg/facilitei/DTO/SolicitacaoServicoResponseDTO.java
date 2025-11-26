package psg.facilitei.DTO;

import psg.facilitei.Entity.Enum.TipoServico;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(description = "DTO para resposta de informações de Solicitação de Serviço")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitacaoServicoResponseDTO {
    private Long id;
    private Long clienteId;
    private Long trabalhadorId;
    private Long servicoId; // Pode vir nulo se ainda não foi aceito
    private TipoServico tipoServico;
    private String descricao;
    private String status;
}