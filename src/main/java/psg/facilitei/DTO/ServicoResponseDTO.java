package psg.facilitei.DTO;

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
    private String titulo; // Renamed from 'nome' to 'titulo' to match entity
    @Schema(description = "Descrição detalhada do serviço", example = "Serviço completo de instalação de ar condicionado.")
    private String descricao;
    @Schema(description = "Preço do serviço", example = "250.00")
    private Double preco;
    @Schema(description = "ID do trabalhador associado a este serviço", example = "1")
    private Long trabalhadorId;
    @Schema(description = "Tipo de serviço", example = "INSTALADOR_AR_CONDICIONADO")
    private TipoServico tipoServico;
}