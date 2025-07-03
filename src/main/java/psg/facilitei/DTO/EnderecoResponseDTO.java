package psg.facilitei.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnderecoResponseDTO {
    private String rua;
    private String numero; // Added based on Endereco entity
    private String bairro; // Added based on Endereco entity
    private String cidade;
    private String estado;
    private String cep;
}