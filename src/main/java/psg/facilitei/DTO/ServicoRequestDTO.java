package psg.facilitei.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import psg.facilitei.Entity.Cliente;
import psg.facilitei.Entity.Enum.TipoServico;

public class ServicoRequestDTO {

    @NotBlank(message = "O nome do serviço é obrigatório.")
    @Size(max = 100, message = "O nome do serviço deve ter no máximo 100 caracteres.")
    private String nome;

    @NotBlank(message = "A descrição do serviço é obrigatória.")
    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres.")
    private String descricao;

    @NotNull(message = "O preço do serviço é obrigatório.")
    @Positive(message = "O preço deve ser um valor positivo.")
    private Double preco;

    @NotNull(message = "O ID do trabalhador é obrigatório.")
    private Long trabalhadorId;

    @NotNull(message = "O tipo de serviço é obrigatório.")
    private TipoServico tipoServico;

    @NotNull(message = "O ID do trabalhador é obrigatório.")
    private Long clienteId;

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

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

}
