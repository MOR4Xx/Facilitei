package psg.facilitei.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteResponseDTO {

    private String nome;
    private String email;
    private String notaCliente; 
    private EnderecoResponseDTO endereco;
}