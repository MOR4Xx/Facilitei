package psg.facilitei.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import psg.facilitei.DTO.AvaliacaoClienteRequestDTO;
import psg.facilitei.DTO.AvaliacaoClienteResponseDTO;
import psg.facilitei.Entity.AvaliacaoCliente;
import psg.facilitei.Entity.Cliente;
import psg.facilitei.Entity.Trabalhador;
import psg.facilitei.Repository.AvaliacaoClienteRepository;
import psg.facilitei.Repository.ClienteRepository;
import psg.facilitei.Repository.TrabalhadorRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvaliacaoClienteService {

    @Autowired
    private AvaliacaoClienteRepository avaliacaoClienteRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private TrabalhadorRepository trabalhadorRepository;

    
    @Transactional
    public AvaliacaoClienteResponseDTO criarAvaliacao(AvaliacaoClienteRequestDTO dto) {

        AvaliacaoCliente avaliacao = toEntity(dto);

        // Calcula nova média do cliente
        Double novaMedia = calcularMediaCliente(avaliacao.getCliente(), dto.getNota());
        avaliacao.setMediaCliente(novaMedia);

        AvaliacaoCliente salvo = avaliacaoClienteRepository.save(avaliacao);

        return toResponseDTO(salvo);
    }


    public List<AvaliacaoClienteResponseDTO> listarPorCliente(Long clienteId) {
        List<AvaliacaoCliente> avaliacoes = avaliacaoClienteRepository.findByClienteId(clienteId);
        return avaliacoes.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<AvaliacaoClienteResponseDTO> listarPorTrabalhador(Long trabalhadorId) {
        List<AvaliacaoCliente> avaliacoes = avaliacaoClienteRepository.findByTrabalhadorId(trabalhadorId);
        return avaliacoes.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

      @Transactional
    public void deletarAvaliacao(Long avaliacaoId) {
        AvaliacaoCliente avaliacao = avaliacaoClienteRepository.findById(avaliacaoId)
                .orElseThrow(() -> new RuntimeException("Avaliação não encontrada"));

        Cliente cliente = avaliacao.getCliente();

        // Deleta a avaliação
        avaliacaoClienteRepository.delete(avaliacao);

        // Recalcula média após a deleção
        atualizarMediaCliente(cliente);
    }


    private AvaliacaoCliente toEntity(AvaliacaoClienteRequestDTO dto) {

        Trabalhador trabalhador = trabalhadorRepository.findById(dto.getTrabalhadorId())
                .orElseThrow(() -> new RuntimeException("Trabalhador não encontrado"));

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        AvaliacaoCliente avaliacao = new AvaliacaoCliente();
        avaliacao.setTrabalhador(trabalhador);
        avaliacao.setCliente(cliente);
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        // mediaCliente será setada depois

        return avaliacao;
    }


    private AvaliacaoClienteResponseDTO toResponseDTO(AvaliacaoCliente entity) {
        AvaliacaoClienteResponseDTO dto = new AvaliacaoClienteResponseDTO();
        dto.setId(entity.getId());
        dto.setTrabalhadorId(entity.getTrabalhador().getId());
        dto.setClienteId(entity.getCliente().getId());
        dto.setNota(entity.getNota());
        dto.setComentario(entity.getComentario());
        dto.setMediaCliente(entity.getMediaCliente());
        return dto;
    }

    
    private Double calcularMediaCliente(Cliente cliente, int novaNota) {
        List<AvaliacaoCliente> avaliacoes = avaliacaoClienteRepository.findAll()
                .stream()
                .filter(a -> a.getCliente().getId().equals(cliente.getId()))
                .toList();

        double soma = avaliacoes.stream().mapToDouble(AvaliacaoCliente::getNota).sum() + novaNota;
        double total = avaliacoes.size() + 1;

        return soma / total;
    }
    

    private void atualizarMediaCliente(Cliente cliente) {
        List<AvaliacaoCliente> avaliacoes = avaliacaoClienteRepository.findByClienteId(cliente.getId());

        double novaMedia = 0.0;
        if (!avaliacoes.isEmpty()) {
            double soma = avaliacoes.stream().mapToDouble(AvaliacaoCliente::getNota).sum();
            novaMedia = soma / avaliacoes.size();
        }

        // Atualiza todas as avaliações restantes do cliente com a nova média
        for (AvaliacaoCliente a : avaliacoes) {
            a.setMediaCliente(novaMedia);
        }
        avaliacaoClienteRepository.saveAll(avaliacoes);
    }

}
