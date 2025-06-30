package psg.facilitei.DTO;

import jakarta.validation.constraints.*;
import java.util.List;

public class AvaliacaoTrabalhadorRequestDTO {

    @NotNull @Min(1) @Max(5)
    private Integer nota;

    
    private String comentario;

    private List<@Size(max = 500) String> fotos;

    @NotNull
    private Long clienteId;

    @NotNull
    private Long trabalhadorId;

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public List<String> getFotos() {
        return fotos;
    }

    public void setFotos(List<String> fotos) {
        this.fotos = fotos;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getTrabalhadorId() {
        return trabalhadorId;
    }

    public void setTrabalhadorId(Long trabalhadorId) {
        this.trabalhadorId = trabalhadorId;
    }
}
