package psg.facilitei.DTO;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import psg.facilitei.Entity.Enum.TipoServico;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrabalhadorRequestDTO {

    @NotBlank(message = "Nome não pode ser vazio!")
    private String nome;

    @NotBlank(message = "Email não pode ser vazio!")
    @Email
    private String email;
    private String telefone;
    private EnderecoRequestDTO endereco;
    private List<TipoServico> habilidades;
    private TipoServico servicoPrincipal;
    private List<Long> avaliacoesIds = new ArrayList<>();
    private String disponibilidade;
    private Double notaTrabalhador;
    private String senha;
    private String sobre;

}