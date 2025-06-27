package psg.facilitei.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "avaliacao_cliente")
public class AvaliacaoCliente extends Avaliacao {

    @Column(name = "trabalhador_id")
    private Long trabalhadorId;

    @Column(name = "cliente_id")
    private Long clienteId;

    public AvaliacaoCliente() {
        super();
    }

    public Long getTrabalhadorId() {
        return trabalhadorId;
    }

    public void setTrabalhadorId(Long trabalhadorId) {
        this.trabalhadorId = trabalhadorId;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }
}
