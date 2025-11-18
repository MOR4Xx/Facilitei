package psg.facilitei.DTO;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrabalhadorResponseDTO {
    private String id;
    private String nome;
    private String email;
    private EnderecoResponseDTO endereco;
    private String telefone;
    private String disponibilidade;
    private List<ServicoResponseDTO> servicos;
    private Double notaTrabalhador;
    private String sobre;
}