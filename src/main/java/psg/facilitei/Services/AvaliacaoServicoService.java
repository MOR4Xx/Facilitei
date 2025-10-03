package psg.facilitei.Services;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import psg.facilitei.DTO.AvaliacaoServicoRequestDTO;
import psg.facilitei.DTO.AvaliacaoServicoResponseDTO;
import psg.facilitei.Entity.AvaliacaoServico;
import psg.facilitei.Entity.Cliente;
import psg.facilitei.Entity.Servico;
import psg.facilitei.Entity.Trabalhador;
import psg.facilitei.Repository.AvaliacaoServicoRepository;
import psg.facilitei.Repository.ClienteRepository;
import psg.facilitei.Repository.ServicoRepository;
import psg.facilitei.Repository.TrabalhadorRepository;

@Service
public class AvaliacaoServicoService {

    @Autowired
    private AvaliacaoServicoRepository repository;
    @Autowired
    private TrabalhadorRepository trabalhadorRepository;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private ServicoRepository servicoRepository;

    @Transactional
public AvaliacaoServicoResponseDTO create(AvaliacaoServicoRequestDTO requestDTO) {

    // Converte DTO para Entity
    AvaliacaoServico avaliacao = toEntity(requestDTO);

    // Salva a avaliação
    AvaliacaoServico savedAvaliacao = repository.save(avaliacao);

    // Recupera o trabalhador pelo serviço avaliado
    Trabalhador trabalhador = savedAvaliacao.getServico().getTrabalhador();

    // Calcula a nova média de avaliações do trabalhador
    Double media = repository.calcularMediaPorTrabalhador(trabalhador.getId());

    // Atualiza a nota do trabalhador
    trabalhador.setNotaTrabalhador(media);
    trabalhadorRepository.save(trabalhador);

    // Retorna DTO de resposta
    return toResponseDTO(savedAvaliacao);
}

public List<AvaliacaoServicoResponseDTO> buscarAvaliacoesPorServico(Long servicoId) {
        List<AvaliacaoServico> avaliacoes = repository.findByServicoId(servicoId);

        return avaliacoes.stream()
                .map(this::toResponseDTO) // usando seu conversor interno
                .toList();
    }

    
    public AvaliacaoServico toEntity(AvaliacaoServicoRequestDTO dto) {
    AvaliacaoServico avaliacao = new AvaliacaoServico();
    avaliacao.setNota(dto.getNota());
    avaliacao.setComentario(dto.getComentario());

    // Busca Cliente pelo ID
    Cliente cliente = clienteRepository.findById(dto.getClienteId())
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado com id " + dto.getClienteId()));
    avaliacao.setCliente(cliente);

    // Busca Servico pelo ID
    Servico servico = servicoRepository.findById(dto.getServicoId())
            .orElseThrow(() -> new RuntimeException("Serviço não encontrado com id " + dto.getServicoId()));
    avaliacao.setServico(servico);

    return avaliacao;
}

@Transactional
    public void deletarAvaliacao(Long avaliacaoId) {
        AvaliacaoServico avaliacao = repository.findById(avaliacaoId)
                .orElseThrow(() -> new RuntimeException("Avaliação não encontrada com id " + avaliacaoId));

        // Pega o trabalhador do serviço da avaliação
        Trabalhador trabalhador = avaliacao.getServico().getTrabalhador();

        // Remove a avaliação
        repository.delete(avaliacao);

        // Recalcula a média do trabalhador (caso ainda tenha outras avaliações)
        Double media = repository.calcularMediaPorTrabalhador(trabalhador.getId());
        trabalhador.setNotaTrabalhador(media != null ? media : 0.0);
        trabalhadorRepository.save(trabalhador);
    }

public AvaliacaoServicoResponseDTO toResponseDTO(AvaliacaoServico avaliacao) {
    AvaliacaoServicoResponseDTO dto = new AvaliacaoServicoResponseDTO();
    dto.setId(avaliacao.getId());
    dto.setNota(avaliacao.getNota());
    dto.setComentario(avaliacao.getComentario());
    dto.setClienteId(avaliacao.getCliente().getId());   // pega ID do Cliente
    dto.setServicoId(avaliacao.getServico().getId());   // pega ID do Servico
    return dto;
}


}
