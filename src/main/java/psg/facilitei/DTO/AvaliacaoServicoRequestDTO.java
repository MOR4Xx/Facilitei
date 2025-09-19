package psg.facilitei.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank; 
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoServicoRequestDTO {

    @NotNull @Min(1) @Max(5)
    private Integer nota;

    @NotBlank(message = "O comentário é obrigatório.") 
    private String comentario;

    private List<@Size(max = 500) String> fotos; 
                                                

    @NotNull
    private Long clienteId;
    @NotNull
    private Long servicoId;
}