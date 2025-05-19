package psg.facilitei.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

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

    private Double mediaAvaliacoes;

    @NotBlank(message = "Informe os dias disponíveis")
    @Column(name = "dias_disponiveis", nullable = false)
    private String diasDisponiveis;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "solicitacao_id")
    private Solicitacao solicitacao;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "O tipo do serviço é obrigatório")
    @Column(name = "tipo_servico", nullable = false)
    private TipoServico tipoServico;

    @ManyToMany
    @JoinTable(name = "servico_trabalhador", joinColumns = @JoinColumn(name = "servico_id"), inverseJoinColumns = @JoinColumn(name = "trabalhador_id"))
    private List<Trabalhador> trabalhador = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "servico_cliente", joinColumns = @JoinColumn(name = "servico_id"), inverseJoinColumns = @JoinColumn(name = "cliente_id"))
    private List<Cliente> clientes = new ArrayList<>();

    public Servico() {
    }

    public Servico(Long id, String titulo, String descricao, Double mediaAvaliacoes, String diasDisponiveis,
            Solicitacao solicitacao, TipoServico tipoServico, List<Trabalhador> trabalhador, List<Cliente> clientes) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.mediaAvaliacoes = mediaAvaliacoes;
        this.diasDisponiveis = diasDisponiveis;
        this.solicitacao = solicitacao;
        this.tipoServico = tipoServico;
        this.trabalhador = trabalhador;
        this.clientes = clientes;
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getMediaAvaliacoes() {
        return mediaAvaliacoes;
    }

    public void setMediaAvaliacoes(Double mediaAvaliacoes) {
        this.mediaAvaliacoes = mediaAvaliacoes;
    }

    public String getDiasDisponiveis() {
        return diasDisponiveis;
    }

    public void setDiasDisponiveis(String diasDisponiveis) {
        this.diasDisponiveis = diasDisponiveis;
    }

    public Solicitacao getSolicitacao() {
        return solicitacao;
    }

    public void setSolicitacao(Solicitacao solicitacao) {
        this.solicitacao = solicitacao;
    }

    public TipoServico getTipoServico() {
        return tipoServico;
    }

    public void setTipoServico(TipoServico tipoServico) {
        this.tipoServico = tipoServico;
    }

    public List<Trabalhador> getTrabalhador() {
        return trabalhador;
    }

    public void setTrabalhador(List<Trabalhador> trabalhador) {
        this.trabalhador = trabalhador;
    }

    public List<Cliente> getClientes() {
        return clientes;
    }

    public void setClientes(List<Cliente> clientes) {
        this.clientes = clientes;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((titulo == null) ? 0 : titulo.hashCode());
        result = prime * result + ((descricao == null) ? 0 : descricao.hashCode());
        result = prime * result + ((mediaAvaliacoes == null) ? 0 : mediaAvaliacoes.hashCode());
        result = prime * result + ((diasDisponiveis == null) ? 0 : diasDisponiveis.hashCode());
        result = prime * result + ((tipoServico == null) ? 0 : tipoServico.hashCode());
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
        if (descricao == null) {
            if (other.descricao != null)
                return false;
        } else if (!descricao.equals(other.descricao))
            return false;
        if (mediaAvaliacoes == null) {
            if (other.mediaAvaliacoes != null)
                return false;
        } else if (!mediaAvaliacoes.equals(other.mediaAvaliacoes))
            return false;
        if (diasDisponiveis == null) {
            if (other.diasDisponiveis != null)
                return false;
        } else if (!diasDisponiveis.equals(other.diasDisponiveis))
            return false;
        if (tipoServico != other.tipoServico)
            return false;
        return true;
    }
}
