package psg.facilitei.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

import psg.facilitei.Entities.Enum.StatusServico;
import psg.facilitei.Entities.Enum.TipoServico;

@Entity
@Table(name = "servico")
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

    private Avaliacao avaliacaoServico;

    @NotBlank(message = "Informe os dias disponíveis")
    @Column(name = "dias_disponiveis", nullable = false)
    private Disponibilidade disponibilidade;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "solicitacao_id")
    private SolicitacaoServico solicitacao;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "O tipo do serviço é obrigatório")
    @Column(name = "tipo_servico", nullable = false)
    private TipoServico tipoServico;

    @ManyToMany
    @JoinTable(name = "servico_trabalhador", joinColumns = @JoinColumn(name = "servico_id"), inverseJoinColumns = @JoinColumn(name = "trabalhador_id"))
    private List<Trabalhador> trabalhador = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "servico_cliente", joinColumns = @JoinColumn(name = "servico_id"), inverseJoinColumns = @JoinColumn(name = "cliente_id"))
    private List<Cliente> cliente = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @NotNull(message = "O tipo do serviço é obrigatório")
    @Column(name = "tipo_servico", nullable = false)
    private StatusServico statusServico;

    public Servico() {
    }

    public Servico(Long id, @NotBlank(message = "O título do serviço é obrigatório") String titulo,
            @NotBlank(message = "A descrição do serviço é obrigatória") String descricao, Avaliacao avaliacaoServico,
            @NotBlank(message = "Informe os dias disponíveis") Disponibilidade disponibilidade,
            SolicitacaoServico solicitacao,
            @NotNull(message = "O tipo do serviço é obrigatório") TipoServico tipoServico,
            List<Trabalhador> trabalhador, List<Cliente> cliente,
            @NotNull(message = "O tipo do serviço é obrigatório") StatusServico statusServico) {
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

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public Avaliacao getAvaliacaoServico() {
        return avaliacaoServico;
    }

    public Disponibilidade getDisponibilidade() {
        return disponibilidade;
    }

    public SolicitacaoServico getSolicitacao() {
        return solicitacao;
    }

    public TipoServico getTipoServico() {
        return tipoServico;
    }

    public List<Trabalhador> getTrabalhador() {
        return trabalhador;
    }

    public List<Cliente> getCliente() {
        return cliente;
    }

    public StatusServico getStatusServico() {
        return statusServico;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public void setAvaliacaoServico(Avaliacao avaliacaoServico) {
        this.avaliacaoServico = avaliacaoServico;
    }

    public void setDisponibilidade(Disponibilidade disponibilidade) {
        this.disponibilidade = disponibilidade;
    }

    public void setSolicitacao(SolicitacaoServico solicitacao) {
        this.solicitacao = solicitacao;
    }

    public void setTipoServico(TipoServico tipoServico) {
        this.tipoServico = tipoServico;
    }

    public void setStatusServico(StatusServico statusServico) {
        this.statusServico = statusServico;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((titulo == null) ? 0 : titulo.hashCode());
        result = prime * result + ((disponibilidade == null) ? 0 : disponibilidade.hashCode());
        result = prime * result + ((tipoServico == null) ? 0 : tipoServico.hashCode());
        result = prime * result + ((trabalhador == null) ? 0 : trabalhador.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Servico other = (Servico) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (titulo == null) {
            if (other.titulo != null)
                return false;
        } else if (!titulo.equals(other.titulo))
            return false;
        if (disponibilidade == null) {
            if (other.disponibilidade != null)
                return false;
        } else if (!disponibilidade.equals(other.disponibilidade))
            return false;
        if (tipoServico != other.tipoServico)
            return false;
        if (trabalhador == null) {
            if (other.trabalhador != null)
                return false;
        } else if (!trabalhador.equals(other.trabalhador))
            return false;
        return true;
    }

   
}
