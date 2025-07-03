package psg.facilitei.Entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode; // Added
import lombok.NoArgsConstructor;
import lombok.ToString; // Added

@Entity
@Table(name = "avaliacao_trabalhador")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Avaliações feitas pelo cliente ao trabalhador")
public class AvaliacaoTrabalhador extends Avaliacao {

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    @EqualsAndHashCode.Exclude // Exclude from equals and hashCode to prevent StackOverflowError
    @ToString.Exclude // Exclude from toString to prevent StackOverflowError
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "trabalhador_id")
    @EqualsAndHashCode.Exclude // Exclude from equals and hashCode to prevent StackOverflowError
    @ToString.Exclude // Exclude from toString to prevent StackOverflowError
    private Trabalhador trabalhador;
}