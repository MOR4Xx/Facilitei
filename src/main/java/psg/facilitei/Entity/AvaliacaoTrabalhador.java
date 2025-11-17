package psg.facilitei.Entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "avaliacao_trabalhador")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Nota media do trabalhador e comentários feitos em seus serviços")
public class AvaliacaoTrabalhador { // <-- SEM "extends Avaliacao"

    // --- 1. ADICIONAR UM ID ---
    // Você precisa de uma chave primária, já que não herda mais
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- 2. ADICIONAR O RELACIONAMENTO (A CORREÇÃO DO CRASH) ---
    // Este é o campo 'trabalhador' que o 'mappedBy' em Trabalhador.java está procurando.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trabalhador_id", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Trabalhador trabalhador;

    // --- 3. ADICIONAR OS CAMPOS QUE ERAM HERDADOS ---
    // Você agora precisa desses campos aqui
    @Min(1)
    @Max(5)
    @Column(name = "nota", nullable = false)
    private int nota;

    @Column(name = "data", nullable = false)
    private Date data = new Date(System.currentTimeMillis());

    @Column(name = "comentario", length = 1000)
    private String comentario;

    @ElementCollection
    @CollectionTable(
            name = "avaliacao_trabalhador_fotos", // Recomendo um nome de tabela diferente
            joinColumns = @JoinColumn(name = "avaliacao_id")
    )
    @Column(name = "url_foto", length = 500)
    private List<String> fotos;

    // --- 4. SEUS CAMPOS ORIGINAIS (QUE JÁ ESTAVAM CORRETOS) ---
    @Column(name = "total_avaliacoes", nullable = false)
    private int totalAvaliacoes;

    @Column(name = "soma_total_notas" ,nullable = false)
    private Double somaTotalNotas;

    private List<String> comentarios_servicos;
}