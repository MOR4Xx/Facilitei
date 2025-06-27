package psg.facilitei.DTO;

import psg.facilitei.Entity.Enum.TipoServico;
import io.swagger.v3.oas.annotations.media.Schema; 

public class ServicoResponseDTO {
    @Schema(description = "ID único do serviço", example = "10")
    private Long id;
    @Schema(description = "Nome do serviço", example = "Instalação de Ar Condicionado") 
    private String nome;
    @Schema(description = "Descrição detalhada do serviço", example = "Serviço completo de instalação de ar condicionado.") 
    private String descricao;
    @Schema(description = "Preço do serviço", example = "250.00") 
    private Double preco;
    @Schema(description = "ID do trabalhador associado a este serviço", example = "1") 
    private Long trabalhadorId;
    @Schema(description = "Tipo de serviço", example = "INSTALADOR_AR_CONDICIONADO") 
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