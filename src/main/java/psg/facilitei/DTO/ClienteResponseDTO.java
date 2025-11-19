package psg.facilitei.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteResponseDTO {

    private String id;
    private String nome;
    private String email;
    
    // Alterado de String para Double para funcionar o .toFixed() no front
    private Double notaCliente; 
    
    private EnderecoResponseDTO endereco;
    private String telefone;
    private String avatarUrl; // Adicione se quiser mostrar o avatar
}