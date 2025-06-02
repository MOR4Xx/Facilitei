package psg.facilitei.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "avaliacao_trabalhador")
public class AvaliacaoTrabalhador extends Avaliacao{

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "trabalhador_id", nullable = false)
    private Trabalhador trabalhador;

    public AvaliacaoTrabalhador() {
    }

    public AvaliacaoTrabalhador(Cliente cliente, Trabalhador trabalhador) {
        this.cliente = cliente;
        this.trabalhador = trabalhador;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Trabalhador getTrabalhador() {
        return trabalhador;
    }

    public void setTrabalhador(Trabalhador trabalhador) {
        this.trabalhador = trabalhador;
    }
}
