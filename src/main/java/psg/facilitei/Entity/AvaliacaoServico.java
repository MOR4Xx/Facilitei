package psg.facilitei.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "avaliacao_servico")
public class AvaliacaoServico extends Avaliacao {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente avaliador;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico avaliado;



    public AvaliacaoServico() {
        super();
    }



    public Cliente getAvaliador() {
        return avaliador;
    }

    public void setAvaliador(Cliente avaliador) {
        this.avaliador = avaliador;
    }

    public Servico getAvaliado() {
        return avaliado;
    }

    public void setAvaliado(Servico avaliado) {
        this.avaliado = avaliado;
    }
}
