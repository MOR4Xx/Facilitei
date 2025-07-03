package psg.facilitei.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode; // Added
import lombok.NoArgsConstructor;
import lombok.ToString; // Added

@Entity
@Table(name = "avaliacao_servico")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvaliacaoServico extends Avaliacao {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    @EqualsAndHashCode.Exclude // Exclude from equals and hashCode to prevent StackOverflowError
    @ToString.Exclude // Exclude from toString to prevent StackOverflowError
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servico_id")
    @EqualsAndHashCode.Exclude // Exclude from equals and hashCode to prevent StackOverflowError
    @ToString.Exclude // Exclude from toString to prevent StackOverflowError
    private Servico servico;
}