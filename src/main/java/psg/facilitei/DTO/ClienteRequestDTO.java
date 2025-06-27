package psg.facilitei.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClienteRequestDTO {

    @NotBlank(message = "O nome é obrigatório.")
    private String nome;
    @NotBlank(message = "O email é obrigatório.")
    private String email;
    @NotBlank(message = "A senha é obrigatória.")
    private String senha;
    @NotBlank(message = "O Endereço é obrigatorio..")
    private EnderecoRequestDTO endereco;


}
