package psg.facilitei.DTO;

import psg.facilitei.Entity.Enum.TipoServico;

public class ServicoResponseDTO {
    private Long id;
    private String nome;
    private String descricao;
    private Double preco;
    private Long trabalhadorId;
    private TipoServico tipoServico;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getPreco() {
        return preco;
    }

    public void setPreco(Double preco) {
        this.preco = preco;
    }

    public Long getTrabalhadorId() {
        return trabalhadorId;
    }

    public void setTrabalhadorId(Long trabalhadorId) {
        this.trabalhadorId = trabalhadorId;
    }

    public TipoServico getTipoServico() {
        return tipoServico;
    }

    public void setTipoServico(TipoServico tipoServico) {
        this.tipoServico = tipoServico;
    }

    

}
