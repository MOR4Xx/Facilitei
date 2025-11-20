package psg.facilitei.DTO;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import psg.facilitei.Entity.Enum.TipoServico;

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
    private List<TipoServico> servicos; 
    private TipoServico servicoPrincipal;
    private Double notaTrabalhador;
    private String sobre;
    private String avatarUrl; 
}