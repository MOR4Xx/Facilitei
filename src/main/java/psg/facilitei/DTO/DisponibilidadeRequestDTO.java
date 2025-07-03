package psg.facilitei.DTO;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data; 
import lombok.NoArgsConstructor; 
import lombok.AllArgsConstructor;


@Schema(description = "DTO para requisição de criação/atualização de Disponibilidade")
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class DisponibilidadeRequestDTO {

    @NotNull(message = "A data e hora de início são obrigatórias.")
    @Schema(description = "Data e hora de início da disponibilidade", example = "2025-07-01T09:00:00")
    private LocalDateTime dataHoraInicio;

    @NotNull(message = "A data e hora de fim são obrigatórias.")
    @Schema(description = "Data e hora de fim da disponibilidade", example = "2025-07-01T17:00:00")
    private LocalDateTime dataHoraFim;

    @NotNull(message = "O ID do trabalhador é obrigatório.")
    @Schema(description = "ID do trabalhador a quem a disponibilidade pertence", example = "1")
    private Long trabalhadorId;
}