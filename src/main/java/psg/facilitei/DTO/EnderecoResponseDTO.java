package psg.facilitei.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EnderecoResponseDTO {
    private String rua;
    private String numero;
    private String bairro;
    private String cidade;
    private String estado;
    private String cep;

}
