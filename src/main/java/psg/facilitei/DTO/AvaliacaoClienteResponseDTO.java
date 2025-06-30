package psg.facilitei.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import psg.facilitei.Entity.Trabalhador;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoClienteResponseDTO {

    @Schema(description = "trabalhador que avaliou")
    private Trabalhador trabalhador;

    @Schema(description = "Nota deixada")
    private int nota;

    @Schema(description = "Comentario deixdo")
    private String comentario;
}
