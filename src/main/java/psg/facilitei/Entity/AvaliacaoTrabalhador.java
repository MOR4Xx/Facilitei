package psg.facilitei.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "avaliacao_trabalhador")
public class AvaliacaoTrabalhador extends Avaliacao {

    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(name = "trabalhador_id")
    private Long trabalhadorId;

    public AvaliacaoTrabalhador() {
        super();
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getTrabalhadorId() {
        return trabalhadorId;
    }

    public void setTrabalhadorId(Long trabalhadorId) {
        this.trabalhadorId = trabalhadorId;
    }
}
