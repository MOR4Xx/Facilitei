package psg.facilitei.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import psg.facilitei.Entity.Enum.StatusServico;
import psg.facilitei.Entity.Enum.TipoServico;



@Entity
@Table(name = "servico")
@Data
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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "avaliacao_id")
    private AvaliacaoServico avaliacaoServico;

    @NotNull(message = "Informe os dias disponíveis")
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "disponibilidade_id", nullable = false)
    private Disponibilidade disponibilidade;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "solicitacao_id")
    private SolicitacaoServico solicitacao;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "O tipo do serviço é obrigatório")
    @Column(name = "tipo_servico", nullable = false)
    private TipoServico tipoServico;

    @ManyToOne
    @JoinTable(name = "servico_trabalhador")
    private Trabalhador trabalhador;

    @ManyToOne
    @JoinTable(name = "servico_cliente")
    private Cliente cliente;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "O tipo do serviço é obrigatório")
    @Column(name = "status_servico", nullable = false)
    private StatusServico statusServico;

    public Servico() {
    }

    public Servico(Long id, @NotBlank(message = "O título do serviço é obrigatório") String titulo,
            @NotBlank(message = "A descrição do serviço é obrigatória") String descricao, AvaliacaoServico avaliacaoServico,
            @NotBlank(message = "Informe os dias disponíveis") Disponibilidade disponibilidade,
            SolicitacaoServico solicitacao,
            @NotNull(message = "O tipo do serviço é obrigatório") TipoServico tipoServico, Trabalhador trabalhador,
            Cliente cliente, @NotNull(message = "O tipo do serviço é obrigatório") StatusServico statusServico) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.avaliacaoServico = avaliacaoServico;
        this.disponibilidade = disponibilidade;
        this.solicitacao = solicitacao;
        this.tipoServico = tipoServico;
        this.trabalhador = trabalhador;
        this.cliente = cliente;
        this.statusServico = statusServico;
    }


}
