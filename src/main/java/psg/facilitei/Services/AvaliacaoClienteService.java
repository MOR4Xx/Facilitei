package psg.facilitei.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import psg.facilitei.DTO.AvaliacaoClienteRequestDTO;
import psg.facilitei.DTO.AvaliacaoClienteResponseDTO;
import psg.facilitei.Entity.AvaliacaoCliente;
import psg.facilitei.Entity.Cliente;
import psg.facilitei.Entity.Trabalhador;
import psg.facilitei.Exceptions.ResourceNotFoundException; // Importante!
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
        // 1. Monta a entidade (busca IDs e valida)
        AvaliacaoCliente avaliacao = toEntity(dto);

        // 2. Busca avaliações anteriores para calcular a média CORRETA
        // (Fazemos isso antes de salvar a nova para garantir o cálculo preciso)
        List<AvaliacaoCliente> avaliacoesAntigas = avaliacaoClienteRepository.findByClienteId(dto.getClienteId());

        double somaNotas = avaliacoesAntigas.stream().mapToDouble(AvaliacaoCliente::getNota).sum();
        somaNotas += dto.getNota(); // Soma a nota atual que está entrando

        double novaMedia = somaNotas / (avaliacoesAntigas.size() + 1);

        // 3. Define a média na avaliação (snapshot histórico)
        avaliacao.setMediaCliente(novaMedia);

        // 4. Salva a avaliação no banco
        AvaliacaoCliente salvo = avaliacaoClienteRepository.save(avaliacao);

        // 5. ATUALIZA O PERFIL DO CLIENTE (O passo que faltava para ser 100%)
        Cliente cliente = avaliacao.getCliente();
        cliente.setNotaCliente(novaMedia);
        clienteRepository.save(cliente);

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
                .orElseThrow(() -> new ResourceNotFoundException("Avaliação não encontrada"));

        Cliente cliente = avaliacao.getCliente();
        avaliacaoClienteRepository.delete(avaliacao);

        // Recalcula média após deleção (opcional, mas recomendado)
        atualizarMediaAposDelecao(cliente);
    }

    private AvaliacaoCliente toEntity(AvaliacaoClienteRequestDTO dto) {
        // Usando ResourceNotFoundException para o Frontend receber 404 e não 500
        // genérico
        Trabalhador trabalhador = trabalhadorRepository.findById(dto.getTrabalhadorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Trabalhador não encontrado. ID: " + dto.getTrabalhadorId()));

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado. ID: " + dto.getClienteId()));

        AvaliacaoCliente avaliacao = new AvaliacaoCliente();
        avaliacao.setTrabalhador(trabalhador);
        avaliacao.setCliente(cliente);
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        // mediaCliente é setada no método criarAvaliacao

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
        dto.setData(entity.getData());
        return dto;
    }

    private void atualizarMediaAposDelecao(Cliente cliente) {
        List<AvaliacaoCliente> restantes = avaliacaoClienteRepository.findByClienteId(cliente.getId());
        if (restantes.isEmpty()) {
            cliente.setNotaCliente(0.0);
        } else {
            double novaMedia = restantes.stream().mapToDouble(AvaliacaoCliente::getNota).average().orElse(0.0);
            cliente.setNotaCliente(novaMedia);
        }
        clienteRepository.save(cliente);
    }
}