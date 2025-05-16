package psg.facilitei.Entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import psg.facilitei.Entities.Enum.TipoServico;

@Entity
public class Servico {

    private Long id;
    private String titulo;
    private String descricao;
    private Double mediaAvaliacoes;
    private String diasDisponiveis;
    private Solicitacao solicitacao;

    private TipoServico tipoServico;
    private List<Trabalhador> trabalhador = new ArrayList<>();
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

    public List<Cliente> getClientes() {
        return clientes;
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
