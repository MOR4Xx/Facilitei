package psg.facilitei.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode; 
import lombok.NoArgsConstructor;
import lombok.ToString; 

@Entity
@Table(name = "avaliacao_servico")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvaliacaoServico extends Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "avaliacao_servico_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    @EqualsAndHashCode.Exclude 
    @ToString.Exclude 
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servico_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Servico servico;

    @Column(name = "nota")
    private int nota;

    @Column(name = "comentario")
    private String comentario;

}