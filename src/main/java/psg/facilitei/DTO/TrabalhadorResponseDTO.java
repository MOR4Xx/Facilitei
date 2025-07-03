package psg.facilitei.DTO;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrabalhadorResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private EnderecoResponseDTO endereco;
    private List<ServicoResponseDTO> servicos;
    private List<AvaliacaoTrabalhadorRequestDTO> avaliacoesTrabalhador;
    private Integer notaTrabalhador;
}