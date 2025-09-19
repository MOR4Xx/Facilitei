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
}