package psg.facilitei.DTO;

import jakarta.validation.constraints.*;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoClienteRequestDTO {

    @NotNull @Min(1) @Max(5)
    private Integer nota;

    @NotBlank(message = "O comentário é obrigatório.") // REQ-AVAL-04 and UC11-Avaliar Cliente specify comment is mandatory
    private String comentario;

    private List<@Size(max = 500) String> fotos;

    @NotNull
    private Long trabalhadorId;

    @NotNull
    private Long clienteId;
}