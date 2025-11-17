package psg.facilitei.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;

@Data
public class AvaliacaoClienteRequestDTO {

    @Schema(description = "ID do trabalhador que avaliou")
    private Long trabalhadorId;

    @Schema(description = "Data de publicação")
    private Date data;

    @Schema(description = "ID do cliente avaliado")
    private Long clienteId;

    @Schema(description = "Nota dada pelo trabalhador")
    private int nota;

    @Schema(description = "Comentário opcional do trabalhador")
    private String comentario;
}
