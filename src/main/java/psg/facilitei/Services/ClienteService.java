package psg.facilitei.Services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import psg.facilitei.Controller.ClienteController;
import psg.facilitei.DTO.*;
import psg.facilitei.Entity.*;
import psg.facilitei.Exceptions.ResourceNotFoundException;
import psg.facilitei.Repository.AvaliacaoClienteRepository;
import psg.facilitei.Repository.AvaliacaoServicoRepository;
import psg.facilitei.Repository.ClienteRepository;
import psg.facilitei.Repository.ServicoRepository;

import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository repository;

    @Autowired
    private AvaliacaoClienteRepository avaliacaoClienteRepository;

    @Autowired
    private AvaliacaoServicoRepository avaliacaoServicoRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private TrabalhadorService trabalhadorService;

    @Autowired
    private ModelMapper modelMapper;

    private Logger logger = Logger.getLogger(ClienteService.class.getName());

    // ===================== CRIAÇÃO =====================
    public ClienteResponseDTO create(ClienteRequestDTO dto) {
        logger.info("Criando cliente");
        Cliente cliente = modelMapper.map(dto, Cliente.class);
        if (dto.getEndereco() != null) {
            cliente.setEndereco(modelMapper.map(dto.getEndereco(), Endereco.class));
        }
        Cliente savedCliente = repository.save(cliente);
        return modelMapper.map(savedCliente, ClienteResponseDTO.class);
    }

    // ===================== CONSULTA POR ID =====================
    public EntityModel<ClienteResponseDTO> findById(Long id) {
        logger.info("Buscando cliente por ID: " + id);
        Cliente clienteEntity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + id));

        ClienteResponseDTO clienteDTO = modelMapper.map(clienteEntity, ClienteResponseDTO.class);

        return EntityModel.of(clienteDTO,
                linkTo(methodOn(ClienteController.class).getAvaliacoes(id)).withRel("busca pelas avaliações que o cliente recebeu"),
                linkTo(methodOn(ClienteController.class).getAvaliacoesServico(id)).withRel("busca pelas avaliações que o cliente fez para serviços"),
                linkTo(methodOn(ClienteController.class).deletar(id)).withRel("excluir cliente"));
    }

    // ===================== AVALIAÇÕES RECEBIDAS =====================
    public List<AvaliacaoClienteResponseDTO> getAvaliacoes(Long id) {
        logger.info("Buscando avaliações recebidas pelo cliente ID: " + id);
        List<AvaliacaoCliente> avaliacoesEntities = avaliacaoClienteRepository.findByClienteId(id);

        return avaliacoesEntities.stream()
                .map(avaliacao -> {
                    AvaliacaoClienteResponseDTO dto = modelMapper.map(avaliacao, AvaliacaoClienteResponseDTO.class);
                    if (avaliacao.getTrabalhador() != null) {
                        dto.setTrabalhadorId(avaliacao.getTrabalhador().getId());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // ===================== AVALIAÇÕES DE SERVIÇOS =====================
    public List<AvaliacaoServicoResponseDTO> getAvaliacoesServico(Long id) {
    logger.info("Buscando avaliações de serviços feitas pelo cliente ID: " + id);
    List<AvaliacaoServico> avaliacaoServicos = avaliacaoServicoRepository.findByClienteId(id);

    return avaliacaoServicos.stream()
            .map(avaliacao -> {
                AvaliacaoServicoResponseDTO dto = new AvaliacaoServicoResponseDTO();
                dto.setId(avaliacao.getId());
                dto.setNota(avaliacao.getNota());
                dto.setComentario(avaliacao.getComentario());
                dto.setFotos(avaliacao.getFotos());

                if (avaliacao.getCliente() != null) {
                    dto.setClienteId(avaliacao.getCliente().getId());
                }

                if (avaliacao.getServico() != null) {
                    dto.setServicoId(avaliacao.getServico().getId());
                }

                return dto;
            })
            .collect(Collectors.toList());
}

    // ===================== CÁLCULO DE NOTA DO TRABALHADOR =====================
    public Double getMediaAvaliacoesTrabalhador(Long idCliente) {
        logger.info("Calculando média das avaliações dos serviços feitos por trabalhadores contratados pelo cliente ID: " + idCliente);

        List<AvaliacaoServico> avaliacoes = avaliacaoServicoRepository.findByClienteId(idCliente);

        if (avaliacoes.isEmpty()) {
            return 0.0;
        }

        double media = avaliacoes.stream()
                .filter(a -> a.getServico() != null && a.getServico().getTrabalhador() != null)
                .collect(Collectors.groupingBy(a -> a.getServico().getTrabalhador().getId(),
                        Collectors.averagingDouble(AvaliacaoServico::getNota)))
                .values()
                .stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);

        return media;
    }

    // ===================== BUSCA DE ENTIDADE =====================
    public Cliente buscarEntidadePorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + id));
    }

    // ===================== ATUALIZAÇÃO =====================
    public ResponseEntity<ClienteResponseDTO> update(Long id, ClienteRequestDTO dto) {
        logger.info("Editando cliente com ID: " + id);
        Cliente clienteAntigo = buscarEntidadePorId(id);

        if (dto.getNome() != null) clienteAntigo.setNome(dto.getNome());
        if (dto.getEmail() != null) clienteAntigo.setEmail(dto.getEmail());
        if (dto.getSenha() != null) clienteAntigo.setSenha(dto.getSenha());

        if (dto.getEndereco() != null) {
            if (clienteAntigo.getEndereco() == null) {
                clienteAntigo.setEndereco(new Endereco());
            }
            modelMapper.map(dto.getEndereco(), clienteAntigo.getEndereco());
        }

        return ResponseEntity.ok(modelMapper.map(repository.save(clienteAntigo), ClienteResponseDTO.class));
    }

    // ===================== EXCLUSÃO =====================
    public ResponseEntity<Void> delete(Long id) {
        logger.info("Deletando cliente com ID: " + id);
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente não encontrado para exclusão com ID: " + id);
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
