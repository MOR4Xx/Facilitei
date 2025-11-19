package psg.facilitei.Services;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import psg.facilitei.DTO.EnderecoResponseDTO;
import psg.facilitei.DTO.ServicoResponseDTO;
import psg.facilitei.DTO.TrabalhadorRequestDTO;
import psg.facilitei.DTO.TrabalhadorResponseDTO;
import psg.facilitei.Entity.AvaliacaoTrabalhador;
import psg.facilitei.Entity.Endereco;
import psg.facilitei.Entity.Servico;
import psg.facilitei.Entity.Trabalhador;
import psg.facilitei.Repository.AvaliacaoClienteRepository;
import psg.facilitei.Repository.AvaliacaoTrabalhadorRepository;
import psg.facilitei.Repository.ServicoRepository;
import psg.facilitei.Repository.TrabalhadorRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrabalhadorService {

    @Autowired
    private TrabalhadorRepository repository;
    @Autowired
    private ServicoRepository servicoRepository;
    @Autowired
    private AvaliacaoTrabalhadorRepository avaliacaoTrabalhadorRepository;
    @Autowired
    private AvaliacaoClienteRepository avaliacaoClienteRepository;


    public TrabalhadorResponseDTO createTrabalhador(TrabalhadorRequestDTO trabalhadorRequestDTO) {
        Trabalhador trabalhador = repository.save(toEntity(trabalhadorRequestDTO));
        return toResponseDTO(trabalhador);
    }

    public List<TrabalhadorResponseDTO> findAll() {
        List<Trabalhador> trabalhadores = repository.findAll();

        return trabalhadores.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public TrabalhadorResponseDTO atualizar(Long id, TrabalhadorRequestDTO dto) {
        Trabalhador trabalhador = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Trabalhador não encontrado com ID: " + id));

        if (dto.getNome() != null) trabalhador.setNome(dto.getNome());
        if (dto.getEmail() != null) trabalhador.setEmail(dto.getEmail());
        if (dto.getSenha() != null) trabalhador.setSenha((dto.getSenha()));
        if (dto.getDisponibilidade() != null) trabalhador.setDisponibilidade(dto.getDisponibilidade());
        if (dto.getSobre() != null) trabalhador.setSobre(dto.getSobre());
        if (dto.getTelefone() != null) trabalhador.setTelefone(dto.getTelefone());

        Endereco endereco = trabalhador.getEndereco();
        if (endereco.getRua() != null) endereco.setRua(dto.getEndereco().getRua());
        if (endereco.getNumero() != null)endereco.setNumero(dto.getEndereco().getNumero());
        if (endereco.getBairro() != null)endereco.setBairro(dto.getEndereco().getBairro());
        if (endereco.getCidade() != null)endereco.setCidade(dto.getEndereco().getCidade());
        if (endereco.getEstado() != null)endereco.setEstado(dto.getEndereco().getEstado());
        if (endereco.getCep() != null)endereco.setCep(dto.getEndereco().getCep());

        return toResponseDTO(repository.save(trabalhador));
    }

    public void delete(Long id) {
        Trabalhador trabalhador = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Trabalhador não encontrado com ID: " + id));


        avaliacaoClienteRepository.deleteByTrabalhadorId(id);
        avaliacaoTrabalhadorRepository.deleteByTrabalhadorId(id);

        repository.delete(trabalhador);
    }

    public TrabalhadorResponseDTO findById(Long id) {
        Trabalhador trabalhador = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Trabalhador não encontrado com ID: " + id));

        return toResponseDTO(trabalhador);
    }

    public Trabalhador buscarEntidadePorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trabalhador não encontrado com ID: " + id));
    }

    public Trabalhador toEntity(TrabalhadorRequestDTO dto) {
        Trabalhador trabalhador = new Trabalhador();

        trabalhador.setNome(dto.getNome());
        trabalhador.setEmail(dto.getEmail());
        trabalhador.setNotaTrabalhador(dto.getNotaTrabalhador());
        trabalhador.setSenha(dto.getSenha());
        trabalhador.setDisponibilidade(dto.getDisponibilidade());
        trabalhador.setSobre(dto.getSobre());
        trabalhador.setTelefone(dto.getTelefone());
        trabalhador.setHabilidades(dto.getHabilidades());
        trabalhador.setServicoPrincipal(dto.getServicoPrincipal());

        Endereco endereco = new Endereco();
        endereco.setRua(dto.getEndereco().getRua());
        endereco.setBairro(dto.getEndereco().getBairro());
        endereco.setCidade(dto.getEndereco().getCidade());
        endereco.setEstado(dto.getEndereco().getEstado());
        endereco.setCep(dto.getEndereco().getCep());
        endereco.setNumero(dto.getEndereco().getNumero());
        trabalhador.setEndereco(endereco);

        if (dto.getHabilidades() != null) {
            trabalhador.setHabilidades(dto.getHabilidades());
        }
        
        if (dto.getServicoPrincipal() != null) {
            trabalhador.setServicoPrincipal(dto.getServicoPrincipal());
        }
        if (dto.getAvaliacoesIds() != null) {
            List<AvaliacaoTrabalhador> avaliacoes = avaliacaoTrabalhadorRepository.findAllById(dto.getAvaliacoesIds());
            trabalhador.setAvaliacoesTrabalhador(avaliacoes);
        }

        return trabalhador;
    }

public TrabalhadorResponseDTO toResponseDTO(Trabalhador entity) {
        TrabalhadorResponseDTO dto = new TrabalhadorResponseDTO();

        dto.setId(String.valueOf(entity.getId()));
        dto.setNome(entity.getNome());
        dto.setEmail(entity.getEmail());
        dto.setTelefone(entity.getTelefone()); // Não esqueça do telefone
        dto.setDisponibilidade(entity.getDisponibilidade());
        dto.setNotaTrabalhador(entity.getNotaTrabalhador());
        dto.setSobre(entity.getSobre());

        // CORREÇÃO 1: Mapeia o serviço principal
        dto.setServicoPrincipal(entity.getServicoPrincipal());

        // CORREÇÃO 2: Mapeia as habilidades (skills) para o campo 'servicos' que o front espera
        if (entity.getHabilidades() != null) {
            dto.setServicos(entity.getHabilidades());
        }

        Endereco endereco = entity.getEndereco();
        if (endereco != null) {
            EnderecoResponseDTO enderecoDTO = new EnderecoResponseDTO();
            enderecoDTO.setRua(endereco.getRua());
            enderecoDTO.setCidade(endereco.getCidade());
            enderecoDTO.setEstado(endereco.getEstado());
            enderecoDTO.setCep(endereco.getCep());
            enderecoDTO.setBairro(endereco.getBairro()); // Adicione se tiver no DTO
            enderecoDTO.setNumero(endereco.getNumero()); // Adicione se tiver no DTO
            dto.setEndereco(enderecoDTO);
        }

        return dto;
    }

}
