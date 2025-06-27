package psg.facilitei.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "avaliacao_servico")
public class AvaliacaoServico extends Avaliacao {

    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(name = "servico_id")
    private Long servicoId;

    public AvaliacaoServico() {
        super();
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getServicoId() {
        return servicoId;
    }

    public void setServicoId(Long servicoId) {
        this.servicoId = servicoId;
    }
}

