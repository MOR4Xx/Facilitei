package psg.facilitei.Entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode; 
import lombok.NoArgsConstructor;
import lombok.ToString; 

@Entity
@Table(name = "avaliacao_cliente")
@Schema(description = "Avaliações que o trabalhador fez ao cliente")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvaliacaoCliente extends Avaliacao {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trabalhador_id")
    @EqualsAndHashCode.Exclude 
    @ToString.Exclude 
    private Trabalhador trabalhador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    @EqualsAndHashCode.Exclude 
    @ToString.Exclude 
    private Cliente cliente;

    @Column(name = "nota", nullable = false)
    private int nota;

    @Column(name = "comentario", length = 1000)
    private String comentario;

    @Column(name = "media_cliente", nullable = false)
    private Double mediaCliente;
}