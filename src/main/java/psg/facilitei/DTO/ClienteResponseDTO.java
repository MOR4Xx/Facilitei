package psg.facilitei.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClienteResponseDTO {

    private String nome;
    private String email;
    private String notacliente;
    private EnderecoResponseDTO endereco;

}
