package psg.facilitei.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import psg.facilitei.DTO.*;
import psg.facilitei.Entity.*;
import psg.facilitei.Repository.AvaliacaoClienteRepository;
import psg.facilitei.Repository.AvaliacaoServicoRepository;
import psg.facilitei.Repository.AvaliacaoTrabalhadorRepository;
import psg.facilitei.Services.AvaliacaoService;

import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
@Tag(name = "Avaliações", description = "Endpoints relacionados às avaliações de serviço, cliente e trabalhador")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    @Autowired
    private AvaliacaoServicoRepository avaliacaoServicoRepo;

    @Autowired
    private AvaliacaoClienteRepository avaliacaoClienteRepo;

    @Autowired
    private AvaliacaoTrabalhadorRepository avaliacaoTrabalhadorRepo;

    @PostMapping("/servico")
    @Operation(summary = "Avaliar Serviço", description = "Cliente avalia um serviço prestado com nota, comentário e fotos (até 3)")
    public ResponseEntity<AvaliacaoServico> avaliarServico(
            @Valid @RequestBody AvaliacaoServicoRequestDTO dto) {
        AvaliacaoServico avaliacao = avaliacaoService.avaliarServico(dto);
        return ResponseEntity.ok(avaliacao);
    }

    @PostMapping("/cliente")
    @Operation(summary = "Avaliar Cliente", description = "Trabalhador avalia o cliente após finalização do serviço")
    public ResponseEntity<AvaliacaoCliente> avaliarCliente(
            @Valid @RequestBody AvaliacaoClienteRequestDTO dto) {
        AvaliacaoCliente avaliacao = avaliacaoService.avaliarCliente(dto);
        return ResponseEntity.ok(avaliacao);
    }

    @PostMapping("/trabalhador")
    @Operation(summary = "Avaliar Trabalhador", description = "Cliente avalia o trabalhador após a prestação do serviço")
    public ResponseEntity<AvaliacaoTrabalhador> avaliarTrabalhador(
            @Valid @RequestBody AvaliacaoTrabalhadorRequestDTO dto) {
        AvaliacaoTrabalhador avaliacao = avaliacaoService.avaliarTrabalhador(dto);
        return ResponseEntity.ok(avaliacao);
    }

    @GetMapping("/servico")
    @Operation(summary = "Listar avaliações de serviço", description = "Retorna todas as avaliações feitas sobre serviços")
    public ResponseEntity<List<AvaliacaoServico>> listarAvaliacoesServico() {
        return ResponseEntity.ok(avaliacaoServicoRepo.findAll());
    }

    @DeleteMapping("/servico/{id}")
    @Operation(summary = "Deletar avaliação de serviço", description = "Remove uma avaliação de serviço pelo ID")
    public ResponseEntity<Void> deletarAvaliacaoServico(@PathVariable Long id) {
        avaliacaoServicoRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cliente")
    @Operation(summary = "Listar avaliações de cliente", description = "Retorna todas as avaliações feitas sobre clientes")
    public ResponseEntity<List<AvaliacaoCliente>> listarAvaliacoesCliente() {
        return ResponseEntity.ok(avaliacaoClienteRepo.findAll());
    }

    @DeleteMapping("/cliente/{id}")
    @Operation(summary = "Deletar avaliação de cliente", description = "Remove uma avaliação de cliente pelo ID")
    public ResponseEntity<Void> deletarAvaliacaoCliente(@PathVariable Long id) {
        avaliacaoClienteRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/trabalhador")
    @Operation(summary = "Listar avaliações de trabalhador", description = "Retorna todas as avaliações feitas sobre trabalhadores")
    public ResponseEntity<List<AvaliacaoTrabalhador>> listarAvaliacoesTrabalhador() {
        return ResponseEntity.ok(avaliacaoTrabalhadorRepo.findAll());
    }

    @DeleteMapping("/trabalhador/{id}")
    @Operation(summary = "Deletar avaliação de trabalhador", description = "Remove uma avaliação de trabalhador pelo ID")
    public ResponseEntity<Void> deletarAvaliacaoTrabalhador(@PathVariable Long id) {
        avaliacaoTrabalhadorRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
