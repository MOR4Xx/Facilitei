package psg.facilitei.DTO;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import io.swagger.v3.oas.annotations.media.Schema; 

@Schema(description = "DTO para requisição de criação/atualização de Disponibilidade")
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

    public LocalDateTime getDataHoraInicio() {
        return dataHoraInicio;
    }

    public void setDataHoraInicio(LocalDateTime dataHoraInicio) {
        this.dataHoraInicio = dataHoraInicio;
    }

    public LocalDateTime getDataHoraFim() {
        return dataHoraFim;
    }

    public void setDataHoraFim(LocalDateTime dataHoraFim) {
        this.dataHoraFim = dataHoraFim;
    }

    public Long getTrabalhadorId() {
        return trabalhadorId;
    }

    public void setTrabalhadorId(Long trabalhadorId) {
        this.trabalhadorId = trabalhadorId;
    }
}
