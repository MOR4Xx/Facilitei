package psg.facilitei.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteRequestDTO {

    @NotBlank(message = "O nome é obrigatório.")
    private String nome;
    @NotBlank(message = "O email é obrigatório.")
    private String email;
    @NotBlank(message = "A senha é obrigatória.")
    private String senha;
    @NotNull(message = "O Endereço é obrigatorio..") 
    @Valid
    private EnderecoRequestDTO endereco;
}