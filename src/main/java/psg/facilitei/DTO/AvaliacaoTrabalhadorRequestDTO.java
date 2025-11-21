package psg.facilitei.DTO;

import lombok.Data;
import java.util.List;

@Data
public class AvaliacaoTrabalhadorRequestDTO {
    private Long clienteId;
    private Long trabalhadorId;
    private Long servicoId;
    private int nota;
    private String comentario;
    private List<String> fotos;
}