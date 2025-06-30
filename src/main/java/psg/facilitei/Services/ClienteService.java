package psg.facilitei.Services;

import jakarta.persistence.Entity;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import psg.facilitei.Controller.ClienteController;
import psg.facilitei.DTO.*;
import psg.facilitei.Entity.AvaliacaoCliente;
import psg.facilitei.Entity.AvaliacaoServico;
import psg.facilitei.Entity.AvaliacaoTrabalhador;
import psg.facilitei.Entity.Cliente;
import psg.facilitei.Repository.AvaliacaoClienteRepository;
import psg.facilitei.Repository.AvaliacaoServicoRepository;
import psg.facilitei.Repository.AvaliacaoTrabalhadorRepository;
import psg.facilitei.Repository.ClienteRepository;

import java.util.List;

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

    public ClienteResponseDTO create(ClienteRequestDTO dto) {

        Cliente cliente = repository.save(modelMapper.map(dto, Cliente.class));

        return modelMapper.map(cliente, ClienteResponseDTO.class);
    }

    public EntityModel<ClienteResponseDTO> findById(Long id) {
        ClienteResponseDTO clienteDTO = modelMapper.map(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com ID: " + id)), ClienteResponseDTO.class);

        EntityModel<ClienteResponseDTO> cliente = EntityModel.of(clienteDTO,
                linkTo(methodOn(ClienteController.class).getAvaliacoes(id)).withRel("busca pelas avaliações que o cliente recebeu do trabalhador"),
                linkTo(methodOn(ClienteController.class).getAvaliacoesTrabalhador(id)).withRel("Busca pelas avaliações que o cliente fez ao trabalhador"),
                linkTo(methodOn(ClienteController.class).getAvaliacoesServico(id)).withRel("Busca pelas avaliações que o cliente fez ao serviço"),
                linkTo(methodOn(ClienteController.class).deletar(id)).withRel("Delete o cliente em caso de exclusão de conta")
                );

        return cliente;
    }

    //Avaliações que o trabalhador fez para o cliente
    public List<AvaliacaoClienteResponseDTO> getAvaliacoes(Long id) {

        List<AvaliacaoCliente> avaliacoesEntities = avaliacaoClienteRepository.findByClienteId(id);
        List<AvaliacaoClienteResponseDTO> avaliacoes = avaliacoesEntities.stream()
                .map(avaliacao -> modelMapper.map(avaliacao, AvaliacaoClienteResponseDTO.class))
                .toList();

        return avaliacoes;
    }

    //Avaliações que o cliente fez para o trabalhador
    public List<AvaliacaoTrabalhadorReponseDTO> getAvaliacoesTrabalhador(Long id) {
        List<AvaliacaoTrabalhador> avaliacoesEntities = avaliacaoTrabalhadorRepository.findByClienteId(id);
        List<AvaliacaoTrabalhadorReponseDTO> avaliacoes = avaliacoesEntities.stream()
                .map(avaliacao -> modelMapper.map(avaliacao, AvaliacaoTrabalhadorReponseDTO.class))
                .toList();

        return avaliacoes;
    }

    //Avaliações que o cliente fez aos serviçoes
    public List<AvaliacaoServicoResponseDTO> getAvaliacoesServico(Long id){

        List<AvaliacaoServico> avaliacaoServicos = avaliacaoServicoRepository.findByClienteId(id);
        List<AvaliacaoServicoResponseDTO> avaliacoes = avaliacaoServicos.stream()
                .map(avaliacao -> modelMapper.map(avaliacao, AvaliacaoServicoResponseDTO.class))
                .toList();

        return avaliacoes;
    }

    public Cliente buscarEntidadePorId(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Cliente não encontrado com ID: " + id));
}


    public ResponseEntity<ClienteResponseDTO> delete(Long id) {
        repository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
