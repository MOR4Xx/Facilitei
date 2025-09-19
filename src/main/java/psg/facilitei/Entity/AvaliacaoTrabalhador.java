package psg.facilitei.Entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode; 
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Entity
@Table(name = "avaliacao_trabalhador")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Nota media do trabalhador e comentários feitos em seus serviços")
public class AvaliacaoTrabalhador extends Avaliacao {

    @Id
    private Long trabalhadorId;

    @Column(name = "nota", nullable = false)
    private Double nota;

    @Column(name = "total_avaliacoes", nullable = false)
    private Long totalAvaliacoes;

    @Column(name = "soma_total_notas" ,nullable = false)
    private Long somaTotalNotas;

    private List<String> comentarios_servicos;
}