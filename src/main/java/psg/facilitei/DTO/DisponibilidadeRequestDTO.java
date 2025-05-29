package psg.facilitei.DTO;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class DisponibilidadeRequestDTO {

    @NotNull(message = "A data e hora de início são obrigatórias.")
    private LocalDateTime dataHoraInicio;

    @NotNull(message = "A data e hora de fim são obrigatórias.")
    private LocalDateTime dataHoraFim;

    @NotNull(message = "O ID do trabalhador é obrigatório.")
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
