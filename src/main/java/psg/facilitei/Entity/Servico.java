
package psg.facilitei.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import psg.facilitei.Entity.Enum.StatusServico;
import psg.facilitei.Entity.Enum.TipoServico;

@Entity
@Table(name = "servico")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O título do serviço é obrigatório")
    @Column(nullable = false)
    private String titulo;

    @NotBlank(message = "A descrição do serviço é obrigatória")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @NotNull(message = "O preço do serviço é obrigatório.")
    @Positive(message = "O preço deve ser um valor positivo.")
    @Column(name = "preco", nullable = false) 
    private Double preco;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "avaliacao_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private AvaliacaoServico avaliacaoServico;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "solicitacao_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private SolicitacaoServico solicitacao;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "O tipo do serviço é obrigatório")
    @Column(name = "tipo_servico", nullable = false)
    private TipoServico tipoServico;

    @ManyToOne
    @JoinColumn(name = "trabalhador_id", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Trabalhador trabalhador;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Cliente cliente;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "O status do serviço é obrigatório.")
    @Column(name = "status_servico", nullable = false, length = 20)
    private StatusServico statusServico;

    
}