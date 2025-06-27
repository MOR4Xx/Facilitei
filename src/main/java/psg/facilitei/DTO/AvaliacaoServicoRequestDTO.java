package psg.facilitei.DTO;

import jakarta.validation.constraints.*;
import java.util.List;

public class AvaliacaoServicoRequestDTO {

    @NotNull @Min(1) @Max(5)
    private Integer nota;

    @NotBlank
    private String comentario;

    private List<@Size(max = 500) String> fotos;

    @NotNull
    private Long clienteId;

    @NotNull
    private Long servicoId;


    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public List<String> getFotos() { return fotos; }
    public void setFotos(List<String> fotos) { this.fotos = fotos; }

    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }

    public Long getServicoId() { return servicoId; }
    public void setServicoId(Long servicoId) { this.servicoId = servicoId; }
}
