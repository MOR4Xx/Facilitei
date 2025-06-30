package psg.facilitei.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import psg.facilitei.DTO.AvaliacaoTrabalhadorRequestDTO;
import psg.facilitei.DTO.EnderecoResponseDTO;
import psg.facilitei.DTO.ServicoResponseDTO;
import psg.facilitei.DTO.TrabalhadorRequestDTO;
import psg.facilitei.DTO.TrabalhadorResponseDTO;
import psg.facilitei.Entity.AvaliacaoTrabalhador;
import psg.facilitei.Entity.Endereco;
import psg.facilitei.Entity.Servico;
import psg.facilitei.Entity.Trabalhador;
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

    public TrabalhadorRequestDTO createTrabalhador(TrabalhadorRequestDTO trabalhadorRequestDTO) {
        repository.save(toEntity(trabalhadorRequestDTO));
        return trabalhadorRequestDTO;
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

        trabalhador.setNome(dto.getNome());
        trabalhador.setEmail(dto.getEmail());
        trabalhador.setSenha((dto.getSenha()));

        Endereco endereco = trabalhador.getEndereco();
        endereco.setRua(dto.getEndereco().getRua());
        endereco.setNumero(dto.getEndereco().getNumero());
        endereco.setBairro(dto.getEndereco().getBairro());
        endereco.setCidade(dto.getEndereco().getCidade());
        endereco.setEstado(dto.getEndereco().getEstado());
        endereco.setCep(dto.getEndereco().getCep());

        trabalhador.setNotaTrabalhador(dto.getNotaTrabalhador());

        return toResponseDTO(repository.save(trabalhador));
    }

    public void delete(Long id) {
        Trabalhador trabalhador = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Trabalhador não encontrado com ID: " + id));

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

        Endereco endereco = new Endereco();
        endereco.setRua(dto.getEndereco().getRua());
        endereco.setBairro(dto.getEndereco().getBairro());
        endereco.setCidade(dto.getEndereco().getCidade());
        endereco.setEstado(dto.getEndereco().getEstado());
        endereco.setCep(dto.getEndereco().getCep());
        endereco.setNumero(dto.getEndereco().getNumero());
        trabalhador.setEndereco(endereco);

        if (dto.getServicosIds() != null) {
            List<Servico> servicos = servicoRepository.findAllById(dto.getServicosIds());
            trabalhador.setServicos(servicos);
        }

        if (dto.getAvaliacoesIds() != null) {
            List<AvaliacaoTrabalhador> avaliacoes = avaliacaoTrabalhadorRepository.findAllById(dto.getAvaliacoesIds());
            trabalhador.setAvaliacoesTrabalhador(avaliacoes);
        }

        return trabalhador;
    }

    public TrabalhadorResponseDTO toResponseDTO(Trabalhador entity) {
        TrabalhadorResponseDTO dto = new TrabalhadorResponseDTO();

        dto.setId(entity.getId());
        dto.setNome(entity.getNome());
        dto.setEmail(entity.getEmail());
        dto.setNotaTrabalhador(entity.getNotaTrabalhador());

        Endereco endereco = entity.getEndereco();
        if (endereco != null) {
            EnderecoResponseDTO enderecoDTO = new EnderecoResponseDTO();
            enderecoDTO.setRua(endereco.getRua());
            enderecoDTO.setCidade(endereco.getCidade());
            enderecoDTO.setEstado(endereco.getEstado());
            enderecoDTO.setCep(endereco.getCep());
            dto.setEndereco(enderecoDTO);
        }

        if (entity.getServicos() != null) {
            List<ServicoResponseDTO> servicosDTO = entity.getServicos().stream().map(servico -> {
                ServicoResponseDTO s = new ServicoResponseDTO();
                s.setId(servico.getId());
                s.setNome(servico.getTitulo());
                s.setDescricao(servico.getDescricao());
                return s;
            }).toList();
            dto.setServicos(servicosDTO);
        }

        if (entity.getAvaliacoesTrabalhador() != null) {
            List<AvaliacaoTrabalhadorRequestDTO> avaliacoesDTO = entity.getAvaliacoesTrabalhador().stream().map(av -> {
                AvaliacaoTrabalhadorRequestDTO a = new AvaliacaoTrabalhadorRequestDTO();
                a.setComentario(av.getComentario());
                a.setNota(av.getNota());
                return a;
            }).toList();
            dto.setAvaliacoesTrabalhador(avaliacoesDTO);
        }

        return dto;
    }

}
