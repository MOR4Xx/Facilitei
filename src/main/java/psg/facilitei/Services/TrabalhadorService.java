package psg.facilitei.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import psg.facilitei.DTO.TrabalhadorRequestDTO;
import psg.facilitei.DTO.TrabalhadorResponseDTO;
import psg.facilitei.Entity.AvaliacaoTrabalhador;
import psg.facilitei.Entity.Endereco;
import psg.facilitei.Entity.Servico;
import psg.facilitei.Entity.Trabalhador;
import psg.facilitei.Exceptions.ResourceNotFoundException;
import psg.facilitei.Repository.AvaliacaoTrabalhadorRepository;
import psg.facilitei.Repository.ServicoRepository;
import psg.facilitei.Repository.TrabalhadorRepository;

@Service
public class TrabalhadorService {

    @Autowired
    private TrabalhadorRepository repository;

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private AvaliacaoTrabalhadorRepository avaliacaoTrabalhadorRepository;

    @Autowired
    private ModelMapper modelMapper;

    // ... (Seus outros métodos como createTrabalhador, findAll, etc. continuam iguais)

    @Transactional
    public TrabalhadorResponseDTO atualizar(Long id, TrabalhadorRequestDTO dto) {
        Trabalhador trabalhador = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trabalhador não encontrado com ID: " + id));

        // Mapeia os campos simples do DTO para a entidade
        modelMapper.map(dto, trabalhador);

        // Atualiza o endereço, se fornecido
        if (dto.getEndereco() != null) {
            if (trabalhador.getEndereco() == null) {
                trabalhador.setEndereco(new Endereco());
            }
            modelMapper.map(dto.getEndereco(), trabalhador.getEndereco());
        }

        // ===================================================================
        // AQUI ESTÁ A CORREÇÃO
        // ===================================================================
        // Atualiza a lista de serviços de forma segura
        if (dto.getServicosIds() != null) {
            List<Servico> novosServicos = servicoRepository.findAllById(dto.getServicosIds());
            // 1. Limpa a lista atual que está ligada ao trabalhador
            trabalhador.getServicos().clear();
            // 2. Adiciona todos os novos serviços à MESMA lista
            trabalhador.getServicos().addAll(novosServicos);
        }
        
        // Mantive a mesma lógica para avaliações para garantir consistência
        if (dto.getAvaliacoesIds() != null) {
            List<AvaliacaoTrabalhador> novasAvaliacoes = avaliacaoTrabalhadorRepository.findAllById(dto.getAvaliacoesIds());
            trabalhador.getAvaliacoesTrabalhador().clear();
            trabalhador.getAvaliacoesTrabalhador().addAll(novasAvaliacoes);
        }
        // ===================================================================

        return modelMapper.map(repository.save(trabalhador), TrabalhadorResponseDTO.class);
    }

    // ... (O resto da sua classe continua igual)
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Trabalhador não encontrado com ID: " + id);
        }
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public TrabalhadorResponseDTO findById(Long id) {
        Trabalhador trabalhador = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trabalhador não encontrado com ID: " + id));
        return modelMapper.map(trabalhador, TrabalhadorResponseDTO.class);
    }

    public Trabalhador buscarEntidadePorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trabalhador não encontrado com ID: " + id));
    }
     @Transactional
    public TrabalhadorResponseDTO createTrabalhador(TrabalhadorRequestDTO trabalhadorRequestDTO) {
        Trabalhador trabalhador = modelMapper.map(trabalhadorRequestDTO, Trabalhador.class);

        if (trabalhadorRequestDTO.getEndereco() != null) {
            trabalhador.setEndereco(modelMapper.map(trabalhadorRequestDTO.getEndereco(), Endereco.class));
        }

        if (trabalhadorRequestDTO.getServicosIds() != null && !trabalhadorRequestDTO.getServicosIds().isEmpty()) {
            List<Servico> servicos = servicoRepository.findAllById(trabalhadorRequestDTO.getServicosIds());
            trabalhador.setServicos(servicos);
        }

        if (trabalhadorRequestDTO.getAvaliacoesIds() != null && !trabalhadorRequestDTO.getAvaliacoesIds().isEmpty()) {
            List<AvaliacaoTrabalhador> avaliacoes = avaliacaoTrabalhadorRepository.findAllById(trabalhadorRequestDTO.getAvaliacoesIds());
            trabalhador.setAvaliacoesTrabalhador(avaliacoes);
        }

        Trabalhador savedTrabalhador = repository.save(trabalhador);
        return modelMapper.map(savedTrabalhador, TrabalhadorResponseDTO.class);
    }

    @Transactional(readOnly = true)
    public List<TrabalhadorResponseDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(trabalhador -> modelMapper.map(trabalhador, TrabalhadorResponseDTO.class))
                .collect(Collectors.toList());
    }
}