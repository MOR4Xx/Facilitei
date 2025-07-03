package psg.facilitei.DTO;

import jakarta.validation.constraints.*;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoTrabalhadorRequestDTO {

    @NotNull @Min(1) @Max(5)
    private Integer nota;

    // Removed @NotBlank, as per AvaliacaoService.java, comentario can be null/empty string.
    // However, REQ-AVAL-02 and REQ-AVAL-04 imply it's mandatory. Sticking to SRS here.
    // Re-adding @NotBlank for consistency with SRS "comentário é obrigatório".
    @NotBlank(message = "O comentário é obrigatório.")
    private String comentario;

    private List<@Size(max = 500) String> fotos;

    @NotNull
    private Long clienteId;

    @NotNull
    private Long trabalhadorId;
}