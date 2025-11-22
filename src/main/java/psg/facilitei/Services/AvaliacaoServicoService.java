package psg.facilitei.Services;

import java.util.List;
import java.util.stream.Collectors;

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
        // 1. Cria e Salva a Avaliação
        AvaliacaoServico avaliacao = toEntity(requestDTO);
        AvaliacaoServico savedAvaliacao = repository.save(avaliacao);

        // 2. Recalcula a média do Trabalhador automaticamente
        Trabalhador trabalhador = savedAvaliacao.getServico().getTrabalhador();
        Double media = repository.calcularMediaPorTrabalhador(trabalhador.getId());
        
        // 3. Atualiza a nota no perfil do trabalhador
        if (media != null) {
            trabalhador.setNotaTrabalhador(media);
            trabalhadorRepository.save(trabalhador);
        }

        return toResponseDTO(savedAvaliacao);
    }

    public List<AvaliacaoServicoResponseDTO> buscarAvaliacoesPorServico(Long servicoId) {
        return repository.findByServicoId(servicoId).stream()
                .map(this::toResponseDTO).collect(Collectors.toList());
    }

    // Método NOVO para listar avaliações no perfil do trabalhador
    public List<AvaliacaoServicoResponseDTO> buscarAvaliacoesPorTrabalhador(Long trabalhadorId) {
        return repository.findByTrabalhadorId(trabalhadorId).stream()
                .map(this::toResponseDTO).collect(Collectors.toList());
    }

    private AvaliacaoServico toEntity(AvaliacaoServicoRequestDTO dto) {
        AvaliacaoServico avaliacao = new AvaliacaoServico();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setData(new java.util.Date()); // Garante data atual

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        avaliacao.setCliente(cliente);

        Servico servico = servicoRepository.findById(dto.getServicoId())
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        avaliacao.setServico(servico);

        return avaliacao;
    }

    private AvaliacaoServicoResponseDTO toResponseDTO(AvaliacaoServico avaliacao) {
        AvaliacaoServicoResponseDTO dto = new AvaliacaoServicoResponseDTO();
        dto.setId(avaliacao.getId());
        dto.setNota(avaliacao.getNota());
        dto.setComentario(avaliacao.getComentario());
        dto.setClienteId(avaliacao.getCliente().getId());
        dto.setServicoId(avaliacao.getServico().getId());
        dto.setData(avaliacao.getData());
        return dto;
    }
    
    @Transactional
    public void deletarAvaliacao(Long id) {
        if(repository.existsById(id)) {
             AvaliacaoServico av = repository.findById(id).get();
             Long trabId = av.getServico().getTrabalhador().getId();
             repository.deleteById(id);
             
             // Recalcula após deletar
             Double media = repository.calcularMediaPorTrabalhador(trabId);
             Trabalhador t = trabalhadorRepository.findById(trabId).get();
             t.setNotaTrabalhador(media != null ? media : 0.0);
             trabalhadorRepository.save(t);
        }
    }
}