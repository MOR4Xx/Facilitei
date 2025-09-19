package psg.facilitei.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import psg.facilitei.Entity.AvaliacaoTrabalhador;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvaliacaoTrabalhadorReponseDTO {


    private Long id;
    private TrabalhadorResponseDTO trabalhador;
    private AvaliacaoTrabalhador avaliacao;

}