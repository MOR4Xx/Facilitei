package psg.facilitei.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class AvaliacaoClienteResponseDTO {

    @Schema(description = "ID da avaliação")
    private Long id;

    @Schema(description = "ID do trabalhador que avaliou")
    private Long trabalhadorId;

    @Schema(description = "ID do cliente avaliado")
    private Long clienteId;

    @Schema(description = "Nota atribuída")
    private int nota;

    @Schema(description = "Comentário do trabalhador")
    private String comentario;

    @Schema(description = "Média atual do cliente")
    private Double mediaCliente;
}
