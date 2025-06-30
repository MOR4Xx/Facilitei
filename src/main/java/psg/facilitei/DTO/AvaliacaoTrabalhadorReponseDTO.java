package psg.facilitei.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import psg.facilitei.Entity.Cliente;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvaliacaoTrabalhadorReponseDTO {

    @Schema(description = "cliente que avaliaoi")
    private Cliente cliente;

    @Schema(description = "Nota deixada")
    private int nota;

    @Schema(description = "Comentario deixdo")
    private String comentario;

    @Schema(description = "Lista de URLs das fotos")
    private List<String> fotos;

}
