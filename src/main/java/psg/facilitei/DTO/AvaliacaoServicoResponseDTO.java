package psg.facilitei.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoServicoResponseDTO {

    @Schema(description = "ID da avaliação")
    private long id;

    @Schema(description = "Cliente que avaliou")
    private long clienteId;

    @Schema(description = "Nota deixada")
    private int nota;

    @Schema(description = "Comentario deixado") 
    private String comentario;

    @Schema(description = "Lista de URLs das fotos")
    private List<String> fotos;

    @Schema(description = "Serviço avaliado")
    private long servicoId;
}