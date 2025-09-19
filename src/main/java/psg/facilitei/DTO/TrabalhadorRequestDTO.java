package psg.facilitei.DTO;

import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrabalhadorRequestDTO {

    @NotBlank
    private String nome;
    @NotBlank
    @Email
    private String email;
  
    private EnderecoRequestDTO endereco; 
    private List<Long> servicosIds;
    private List<Long> avaliacoesIds;
    private Integer notaTrabalhador;
    private String senha; 
}