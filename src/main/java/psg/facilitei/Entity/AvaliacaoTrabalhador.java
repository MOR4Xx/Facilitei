package psg.facilitei.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "avaliacao_trabalhador")
public class AvaliacaoTrabalhador extends Avaliacao {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente avaliador;      // quem faz a avaliação

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "trabalhador_id", nullable = false)
    private Trabalhador avaliado;   // quem está sendo avaliado


    public AvaliacaoTrabalhador() {
        super();
    }


    public Cliente getAvaliador() {
        return avaliador;
    }

    public void setAvaliador(Cliente avaliador) {
        this.avaliador = avaliador;
    }

    public Trabalhador getAvaliado() {
        return avaliado;
    }

    public void setAvaliado(Trabalhador avaliado) {
        this.avaliado = avaliado;
    }
}
