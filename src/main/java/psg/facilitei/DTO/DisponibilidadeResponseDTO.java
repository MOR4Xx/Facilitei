package psg.facilitei.DTO;

import java.time.LocalDateTime;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Schema(description = "DTO para resposta de informações de Disponibilidade")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisponibilidadeResponseDTO {
    @Schema(description = "ID único da disponibilidade", example = "1")
    private Long id;
    @Schema(description = "Data e hora de início da disponibilidade", example = "2025-07-01T09:00:00")
    private LocalDateTime dataHoraInicio;
    @Schema(description = "Data e hora de fim da disponibilidade", example = "2025-07-01T17:00:00")
    private LocalDateTime dataHoraFim;
    @Schema(description = "ID do trabalhador associado a esta disponibilidade", example = "1")
    private Long trabalhadorId;
}