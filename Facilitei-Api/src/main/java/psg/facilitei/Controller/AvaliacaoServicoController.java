package psg.facilitei.Controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import psg.facilitei.DTO.AvaliacaoServicoRequestDTO;
import psg.facilitei.DTO.AvaliacaoServicoResponseDTO;
import psg.facilitei.Services.AvaliacaoServicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes-servico")
@Tag(name = "Avaliações", description = "Endpoints relacionados às avaliações de serviço")
public class AvaliacaoServicoController {

    @Autowired
    private AvaliacaoServicoService service;

    @PostMapping("/Criar")
    public ResponseEntity<AvaliacaoServicoResponseDTO> criarAvaliacao(@RequestBody AvaliacaoServicoRequestDTO requestDTO) {
        return ResponseEntity.status(201).body(service.create(requestDTO));
    }

    @GetMapping("/{servicoId}")
    public ResponseEntity<List<AvaliacaoServicoResponseDTO>> listarAvaliacoesPorServico(@PathVariable Long servicoId) {
        return ResponseEntity.ok(service.buscarAvaliacoesPorServico(servicoId));
    }

    // NOVO ENDPOINT: Busca todas as avaliações recebidas por um trabalhador
    @GetMapping("/trabalhador/{trabalhadorId}")
    public ResponseEntity<List<AvaliacaoServicoResponseDTO>> listarPorTrabalhador(@PathVariable Long trabalhadorId) {
        return ResponseEntity.ok(service.buscarAvaliacoesPorTrabalhador(trabalhadorId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAvaliacao(@PathVariable Long id) {
        service.deletarAvaliacao(id);
        return ResponseEntity.noContent().build();
    }
}