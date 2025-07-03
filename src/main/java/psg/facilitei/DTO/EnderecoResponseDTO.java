package psg.facilitei.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnderecoResponseDTO {
    private String rua;
    private String numero; 
    private String bairro; 
    private String cidade;
    private String estado;
    private String cep;
}