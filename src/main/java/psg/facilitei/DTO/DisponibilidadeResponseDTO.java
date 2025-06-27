package psg.facilitei.DTO;

import java.time.LocalDateTime;
import io.swagger.v3.oas.annotations.media.Schema; 

@Schema(description = "DTO para resposta de informações de Disponibilidade")
public class DisponibilidadeResponseDTO {
    @Schema(description = "ID único da disponibilidade", example = "1")
    private Long id;
    @Schema(description = "Data e hora de início da disponibilidade", example = "2025-07-01T09:00:00")
    private LocalDateTime dataHoraInicio;
    @Schema(description = "Data e hora de fim da disponibilidade", example = "2025-07-01T17:00:00")
    private LocalDateTime dataHoraFim;
    @Schema(description = "ID do trabalhador associado a esta disponibilidade", example = "1")
    private Long trabalhadorId;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
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
