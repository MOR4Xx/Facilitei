// mor4xx/facilitei/Facilitei-d427a563d4621b17bc84b9d2a9232fff512c93a8/src/main/java/psg/facilitei/Services/ClienteService.java
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
import psg.facilitei.Repository.AvaliacaoTrabalhadorRepository;
import psg.facilitei.Repository.ClienteRepository;
import psg.facilitei.Repository.ServicoRepository; // Added ServicoRepository

import java.util.List;
import java.util.stream.Collectors;
import java.util.logging.Logger; // Import Logger

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository repository;

    @Autowired
    private AvaliacaoClienteRepository avaliacaoClienteRepository;

    @Autowired
    private AvaliacaoTrabalhadorRepository avaliacaoTrabalhadorRepository;

    @Autowired
    private AvaliacaoServicoRepository avaliacaoServicoRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private TrabalhadorService trabalhadorService;

    @Autowired
    private ServicoRepository servicoRepository; // Changed from ServicoService to ServicoRepository to break cycle

    private Logger logger = Logger.getLogger(ClienteService.class.getName()); // Initialize Logger

    public ClienteResponseDTO create(ClienteRequestDTO dto) {
        logger.info("Criando cliente");
        Cliente cliente = modelMapper.map(dto, Cliente.class);
        if (dto.getEndereco() != null) {
            cliente.setEndereco(modelMapper.map(dto.getEndereco(), Endereco.class));
        }
        Cliente savedCliente = repository.save(cliente);
        return modelMapper.map(savedCliente, ClienteResponseDTO.class);
    }

    public EntityModel<ClienteResponseDTO> findById(Long id) {
        logger.info("Buscando cliente por ID: " + id);
        Cliente clienteEntity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + id));
        ClienteResponseDTO clienteDTO = modelMapper.map(clienteEntity, ClienteResponseDTO.class);

        EntityModel<ClienteResponseDTO> cliente = EntityModel.of(clienteDTO,
                linkTo(methodOn(ClienteController.class).getAvaliacoes(id)).withRel("busca pelas avaliações que o trabalhador recebeu do cliente"),
                linkTo(methodOn(ClienteController.class).getAvaliacoesTrabalhador(id)).withRel("Busca pelas avaliações que o cliente fez ao trabalhador"),
                linkTo(methodOn(ClienteController.class).getAvaliacoesServico(id)).withRel("Busca pelas avaliações que o cliente fez ao serviço"),
                linkTo(methodOn(ClienteController.class).deletar(id)).withRel("Delete o cliente em caso de exclusão de conta")
        );
        return cliente;
    }

    // Avaliações que o trabalhador fez para o cliente (Cliente recebeu)
    public List<AvaliacaoClienteResponseDTO> getAvaliacoes(Long id) {
        logger.info("Buscando Avaliações que o cliente " + id + " recebeu");
        List<AvaliacaoCliente> avaliacoesEntities = avaliacaoClienteRepository.findByClienteId(id);
        return avaliacoesEntities.stream()
                .map(avaliacao -> {
                    AvaliacaoClienteResponseDTO dto = modelMapper.map(avaliacao, AvaliacaoClienteResponseDTO.class);
                    if (avaliacao.getTrabalhador() != null) {
                        dto.setTrabalhador(modelMapper.map(avaliacao.getTrabalhador(), TrabalhadorResponseDTO.class));
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Avaliações que o cliente fez para o trabalhador (Cliente avaliou)
    public List<AvaliacaoTrabalhadorReponseDTO> getAvaliacoesTrabalhador(Long id) {
        logger.info("Busca Avaliações que o cliente " + id + " fez para o trabalhador");
        List<AvaliacaoTrabalhador> avaliacoesEntities = avaliacaoTrabalhadorRepository.findByClienteId(id);
        return avaliacoesEntities.stream()
                .map(avaliacao -> {
                    AvaliacaoTrabalhadorReponseDTO dto = modelMapper.map(avaliacao, AvaliacaoTrabalhadorReponseDTO.class);
                    if (avaliacao.getCliente() != null) {
                        dto.setCliente(modelMapper.map(avaliacao.getCliente(), ClienteResponseDTO.class));
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Avaliações que o cliente fez aos serviços (Cliente avaliou)
    public List<AvaliacaoServicoResponseDTO> getAvaliacoesServico(Long id) {
        logger.info("Busca avaliações que o cliente " + id + " fez para os serviços");
        List<AvaliacaoServico> avaliacaoServicos = avaliacaoServicoRepository.findByClienteId(id);
        return avaliacaoServicos.stream()
                .map(avaliacao -> {
                    AvaliacaoServicoResponseDTO dto = modelMapper.map(avaliacao, AvaliacaoServicoResponseDTO.class);
                    if (avaliacao.getCliente() != null) {
                        dto.setCliente(modelMapper.map(avaliacao.getCliente(), ClienteResponseDTO.class));
                    }
                    // Fetch Servico directly from repository to break circular dependency
                    if (avaliacao.getServico() != null) {
                        Servico servicoEntity = servicoRepository.findById(avaliacao.getServico().getId())
                            .orElseThrow(() -> new ResourceNotFoundException("Serviço associado à avaliação não encontrado com ID: " + avaliacao.getServico().getId()));
                        dto.setServico(modelMapper.map(servicoEntity, ServicoResponseDTO.class));
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public Cliente buscarEntidadePorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + id));
    }

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

    public ResponseEntity<Void> delete(Long id) {
        logger.info("Deletando cliente com ID: " + id);
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente não encontrado para exclusão com ID: " + id);
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}