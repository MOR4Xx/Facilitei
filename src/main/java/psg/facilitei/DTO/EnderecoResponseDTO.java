package psg.facilitei.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import psg.facilitei.Entity.Endereco;

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
