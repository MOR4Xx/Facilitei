package psg.facilitei.DTO;

import psg.facilitei.Entity.Enum.StatusServico;
import psg.facilitei.Entity.Enum.TipoServico;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO para resposta de informações de Serviço")
public class ServicoResponseDTO {

    @Schema(description = "ID único do serviço", example = "10")
    private Long id;

    @Schema(description = "Nome do serviço", example = "Instalação de Ar Condicionado")
    private String titulo;

    @Schema(description = "Descrição detalhada do serviço", example = "Serviço completo de instalação de ar condicionado.")
    private String descricao;

    @Schema(description = "ID do trabalhador associado a este serviço", example = "1")
    private Long trabalhadorId;

    @Schema(description = "ID do cliente que solicitou o serviço", example = "2")
    private Long clienteId;

    @Schema(description = "ID da disponibilidade associada ao serviço", example = "1")
    private Long disponibilidadeId;

    @Schema(description = "Tipo de serviço", example = "INSTALADOR_AR_CONDICIONADO")
    private TipoServico tipoServico;

    @Schema(description = "Status atual do serviço", example = "PENDENTE")
    private StatusServico statusServico;
}