package psg.facilitei.Entities;

import java.util.ArrayList;
import java.util.List;

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
    private String diaSemana;

    @NotBlank(message = "O horário de início não pode estar em branco")
    @Column(name = "horario_inicio", nullable = false)
    private String horarioInicio;

    @NotBlank(message = "O horário de fim não pode estar em branco")
    @Column(name = "horario_fim", nullable = false)
    private String horarioFim;

    @ManyToMany(mappedBy = "disponibilidades")
    private List<Trabalhador> trabalhadores = new ArrayList<>();

    @OneToMany(mappedBy = "disponibilidade")
    private List<Servico> servicos = new ArrayList<>();

    public Disponibilidade() {}

    public Disponibilidade(Long id, String diaSemana, String horarioInicio, String horarioFim,
            List<Trabalhador> trabalhadores, List<Servico> servicos) {
        this.id = id;
        this.diaSemana = diaSemana;
        this.horarioInicio = horarioInicio;
        this.horarioFim = horarioFim;
        this.trabalhadores = trabalhadores;
        this.servicos = servicos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(String diaSemana) {
        this.diaSemana = diaSemana;
    }

    public String getHorarioInicio() {
        return horarioInicio;
    }

    public void setHorarioInicio(String horarioInicio) {
        this.horarioInicio = horarioInicio;
    }

    public String getHorarioFim() {
        return horarioFim;
    }

    public void setHorarioFim(String horarioFim) {
        this.horarioFim = horarioFim;
    }

    public List<Trabalhador> getTrabalhadores() {
        return trabalhadores;
    }

    public List<Servico> getServicos() {
        return servicos;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((diaSemana == null) ? 0 : diaSemana.hashCode());
        result = prime * result + ((horarioInicio == null) ? 0 : horarioInicio.hashCode());
        result = prime * result + ((horarioFim == null) ? 0 : horarioFim.hashCode());
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
        if (diaSemana == null) {
            if (other.diaSemana != null)
                return false;
        } else if (!diaSemana.equals(other.diaSemana))
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
        return true;
    }

    // hashCode e equals mantidos como estão


   
    
    
}
