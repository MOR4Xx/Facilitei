// mor4xx/facilitei/Facilitei-d427a563d4621b17bc84b9d2a9232fff512c93a8/src/main/java/psg/facilitei/Controller/AvaliacaoController.java
package psg.facilitei.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import psg.facilitei.DTO.*;
import psg.facilitei.Entity.*; // Still importing entities, but will map to DTOs for responses.
import psg.facilitei.Repository.AvaliacaoClienteRepository; // Still directly using repos here for list/delete
import psg.facilitei.Repository.AvaliacaoServicoRepository;
import psg.facilitei.Repository.AvaliacaoTrabalhadorRepository;
import psg.facilitei.Services.AvaliacaoService;
import org.modelmapper.ModelMapper; // Added for mapping in controller

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/avaliacoes")
@Tag(name = "Avaliações", description = "Endpoints relacionados às avaliações de serviço, cliente e trabalhador")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    @Autowired
    private AvaliacaoServicoRepository avaliacaoServicoRepo; // Used for listing/deleting
    @Autowired
    private AvaliacaoClienteRepository avaliacaoClienteRepo; // Used for listing/deleting
    @Autowired
    private AvaliacaoTrabalhadorRepository avaliacaoTrabalhadorRepo; // Used for listing/deleting

    @Autowired
    private ModelMapper modelMapper; // Injected ModelMapper for DTO conversion

    @PostMapping("/servico")
    @Operation(summary = "Avaliar Serviço", description = "Cliente avalia um serviço prestado com nota, comentário e fotos (até 3)")
    public ResponseEntity<AvaliacaoServicoResponseDTO> avaliarServico(@Valid @RequestBody AvaliacaoServicoRequestDTO dto) {
        AvaliacaoServico avaliacao = avaliacaoService.avaliarServico(dto);
        return ResponseEntity.ok(modelMapper.map(avaliacao, AvaliacaoServicoResponseDTO.class)); // Return DTO
    }

    @PostMapping("/cliente")
    @Operation(summary = "Avaliar Cliente", description = "Trabalhador avalia o cliente após finalização do serviço")
    public ResponseEntity<AvaliacaoClienteResponseDTO> avaliarCliente(@Valid @RequestBody AvaliacaoClienteRequestDTO dto) {
        AvaliacaoCliente avaliacao = avaliacaoService.avaliarCliente(dto);
        return ResponseEntity.ok(modelMapper.map(avaliacao, AvaliacaoClienteResponseDTO.class)); // Return DTO
    }

    @PostMapping("/trabalhador")
    @Operation(summary = "Avaliar Trabalhador", description = "Cliente avalia o trabalhador após a prestação do serviço")
    public ResponseEntity<AvaliacaoTrabalhadorReponseDTO> avaliarTrabalhador(@Valid @RequestBody AvaliacaoTrabalhadorRequestDTO dto) {
        AvaliacaoTrabalhador avaliacao = avaliacaoService.avaliarTrabalhador(dto);
        return ResponseEntity.ok(modelMapper.map(avaliacao, AvaliacaoTrabalhadorReponseDTO.class)); // Return DTO
    }

    @GetMapping("/servico")
    @Operation(summary = "Listar avaliações de serviço", description = "Retorna todas as avaliações feitas sobre serviços")
    public ResponseEntity<List<AvaliacaoServicoResponseDTO>> listarAvaliacoesServico() {
        // Ideally, this mapping should be in the service layer, but for current scope, doing it here.
        List<AvaliacaoServico> avaliacoes = avaliacaoServicoRepo.findAll();
        List<AvaliacaoServicoResponseDTO> dtos = avaliacoes.stream()
                .map(avaliacao -> modelMapper.map(avaliacao, AvaliacaoServicoResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/servico/{id}")
    @Operation(summary = "Deletar avaliação de serviço", description = "Remove uma avaliação de serviço pelo ID")
    public ResponseEntity<Void> deletarAvaliacaoServico(@PathVariable Long id) {
        avaliacaoServicoRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cliente")
    @Operation(summary = "Listar avaliações de cliente", description = "Retorna todas as avaliações feitas sobre clientes")
    public ResponseEntity<List<AvaliacaoClienteResponseDTO>> listarAvaliacoesCliente() {
        // Ideally, this mapping should be in the service layer, but for current scope, doing it here.
        List<AvaliacaoCliente> avaliacoes = avaliacaoClienteRepo.findAll();
        List<AvaliacaoClienteResponseDTO> dtos = avaliacoes.stream()
                .map(avaliacao -> modelMapper.map(avaliacao, AvaliacaoClienteResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/cliente/{id}")
    @Operation(summary = "Deletar avaliação de cliente", description = "Remove uma avaliação de cliente pelo ID")
    public ResponseEntity<Void> deletarAvaliacaoCliente(@PathVariable Long id) {
        avaliacaoClienteRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/trabalhador")
    @Operation(summary = "Listar avaliações de trabalhador", description = "Retorna todas as avaliações feitas sobre trabalhadores")
    public ResponseEntity<List<AvaliacaoTrabalhadorReponseDTO>> listarAvaliacoesTrabalhador() {
        // Ideally, this mapping should be in the service layer, but for current scope, doing it here.
        List<AvaliacaoTrabalhador> avaliacoes = avaliacaoTrabalhadorRepo.findAll();
        List<AvaliacaoTrabalhadorReponseDTO> dtos = avaliacoes.stream()
                .map(avaliacao -> modelMapper.map(avaliacao, AvaliacaoTrabalhadorReponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/trabalhador/{id}")
    @Operation(summary = "Deletar avaliação de trabalhador", description = "Remove uma avaliação de trabalhador pelo ID")
    public ResponseEntity<Void> deletarAvaliacaoTrabalhador(@PathVariable Long id) {
        avaliacaoTrabalhadorRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}