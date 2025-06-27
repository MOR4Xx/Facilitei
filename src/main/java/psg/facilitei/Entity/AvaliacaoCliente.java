package psg.facilitei.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "avaliacao_cliente")
public class AvaliacaoCliente extends Avaliacao {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "trabalhador_id", nullable = false)
    private Trabalhador avaliador;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente avaliado;



    public AvaliacaoCliente() {
        super();
    }

    public Trabalhador getAvaliador() {
        return avaliador;
    }

    public void setAvaliador(Trabalhador avaliador) {
        this.avaliador = avaliador;
    }

    public Cliente getAvaliado() {
        return avaliado;
    }

    public void setAvaliado(Cliente avaliado) {
        this.avaliado = avaliado;
    }
}
