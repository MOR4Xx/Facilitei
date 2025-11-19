package psg.facilitei.DTO;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import psg.facilitei.Entity.Enum.TipoServico; // Importe o Enum

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
    
    // Alterado: Agora retorna a lista de habilidades (TipoServico) em vez de objetos de serviço
    private List<TipoServico> servicos; 
    
    // Novo: Campo obrigatório para o frontend funcionar
    private TipoServico servicoPrincipal;
    
    private Double notaTrabalhador;
    private String sobre;
}