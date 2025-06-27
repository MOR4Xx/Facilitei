package psg.facilitei.DTO;

import io.swagger.v3.oas.annotations.media.Schema; 

@Schema(description = "DTO para resposta de informações de Solicitação de Serviço")
public class SolicitacaoServicoResponseDTO {
    @Schema(description = "ID único da solicitação de serviço", example = "5")
    private Long id;
    @Schema(description = "ID do cliente solicitante", example = "2")
    private Long clienteId;
    @Schema(description = "ID do serviço solicitado", example = "10")
    private Long servicoId;
    @Schema(description = "Descrição da solicitação", example = "Instalação de um novo chuveiro na residência.")
    private String descricao;
    @Schema(description = "Status atual da solicitação (PENDENTE, ACEITA, RECUSADA, etc.)", example = "PENDENTE")
    private String status;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getClienteId() {
        return clienteId;
    }
    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }
    public Long getServicoId() {
        return servicoId;
    }
    public void setServicoId(Long servicoId) {
        this.servicoId = servicoId;
    }
    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}
