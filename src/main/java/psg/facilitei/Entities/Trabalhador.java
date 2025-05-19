package psg.facilitei.Entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import psg.facilitei.Entities.Enum.TipoServico;

@Entity
@Table(name = "trabalhador")
public class Trabalhador extends Cliente {

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "trabalhador_tipos_servico", joinColumns = @JoinColumn(name = "trabalhador_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_servico")
    private List<TipoServico> tipoServico = new ArrayList<>();


    public Trabalhador() {
    }

    public List<TipoServico> getTipoServico() {
        return tipoServico;
    }

    public void setTipoServico(List<TipoServico> tipoServico) {
        this.tipoServico = tipoServico;
    }
}
