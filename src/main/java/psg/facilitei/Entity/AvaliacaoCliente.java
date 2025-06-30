package psg.facilitei.Entity;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "avaliacao_cliente")
@Schema(description = "Avaliações que o trabalhador fez ao cliente")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvaliacaoCliente extends Avaliacao {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trabalhador_id")
    private Trabalhador trabalhador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<AvaliacaoTrabalhador> avaliacoesTrabalhador;

}
