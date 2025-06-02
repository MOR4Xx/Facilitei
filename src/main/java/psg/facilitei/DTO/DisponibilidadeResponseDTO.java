package psg.facilitei.DTO;


import java.time.LocalDateTime;

public class DisponibilidadeResponseDTO {
    private Long id;
    private LocalDateTime dataHoraInicio;
    private LocalDateTime dataHoraFim;
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
