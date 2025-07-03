package psg.facilitei.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List; 

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoClienteResponseDTO {

    @Schema(description = "Trabalhador que avaliou")
    private TrabalhadorResponseDTO trabalhador; 

    @Schema(description = "Nota deixada")
    private int nota;

    @Schema(description = "Comentario deixado")
    private String comentario;

    @Schema(description = "Lista de URLs das fotos") 
    private List<String> fotos;
}