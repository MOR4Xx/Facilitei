package psg.facilitei.Entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "disponibilidade")
public class Disponibilidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O dia da semana não pode estar em branco")
    @Column(name = "dia_semana", nullable = false)
    private LocalDateTime Data;

    @NotBlank(message = "O horário de início não pode estar em branco")
    @Column(name = "horario_inicio", nullable = false)
    private LocalDateTime horarioInicio;

    @NotBlank(message = "O horário de fim não pode estar em branco")
    @Column(name = "horario_fim", nullable = false)
    private LocalDateTime horarioFim;

    @ManyToOne
    @JoinColumn(name = "trabalhador_id", nullable = false)
    @JsonIgnore
    private Trabalhador trabalhador;

    @OneToMany(mappedBy = "disponibilidade")
    private List<Servico> servicos = new ArrayList<>();

    public Disponibilidade() {
    }

    public Disponibilidade(Long id, @NotBlank(message = "O dia da semana não pode estar em branco") LocalDateTime data,
            @NotBlank(message = "O horário de início não pode estar em branco") LocalDateTime horarioInicio,
            @NotBlank(message = "O horário de fim não pode estar em branco") LocalDateTime horarioFim,
            Trabalhador trabalhador, List<Servico> servicos) {
        this.id = id;
        Data = data;
        this.horarioInicio = horarioInicio;
        this.horarioFim = horarioFim;
        this.trabalhador = trabalhador;
        this.servicos = servicos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getData() {
        return Data;
    }

    public void setData(LocalDateTime data) {
        Data = data;
    }

    public LocalDateTime getHorarioInicio() {
        return horarioInicio;
    }

    public void setHorarioInicio(LocalDateTime horarioInicio) {
        this.horarioInicio = horarioInicio;
    }

    public LocalDateTime getHorarioFim() {
        return horarioFim;
    }

    public void setHorarioFim(LocalDateTime horarioFim) {
        this.horarioFim = horarioFim;
    }

    public Trabalhador getTrabalhador() {
        return trabalhador;
    }
    
    public void setTrabalhador(Trabalhador trabalhador) {
        this.trabalhador = trabalhador;
    }

    public void setServicos(List<Servico> servicos) {
        this.servicos = servicos;
    }

    public List<Servico> getServicos() {
        return servicos;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((Data == null) ? 0 : Data.hashCode());
        result = prime * result + ((horarioInicio == null) ? 0 : horarioInicio.hashCode());
        result = prime * result + ((horarioFim == null) ? 0 : horarioFim.hashCode());
        result = prime * result + ((servicos == null) ? 0 : servicos.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Disponibilidade other = (Disponibilidade) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (Data == null) {
            if (other.Data != null)
                return false;
        } else if (!Data.equals(other.Data))
            return false;
        if (horarioInicio == null) {
            if (other.horarioInicio != null)
                return false;
        } else if (!horarioInicio.equals(other.horarioInicio))
            return false;
        if (horarioFim == null) {
            if (other.horarioFim != null)
                return false;
        } else if (!horarioFim.equals(other.horarioFim))
            return false;
        if (servicos == null) {
            if (other.servicos != null)
                return false;
        } else if (!servicos.equals(other.servicos))
            return false;
        return true;
    }

}
