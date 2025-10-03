
package psg.facilitei.Controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import psg.facilitei.DTO.AvaliacaoServicoRequestDTO;
import psg.facilitei.DTO.AvaliacaoServicoResponseDTO;
import psg.facilitei.Services.AvaliacaoServicoService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/avaliacoes/Servico")
@Tag(name = "Avaliações", description = "Endpoints relacionados às avaliações de serviço, cliente e trabalhador")
public class AvaliacaoServicoController {


    private AvaliacaoServicoService service;

    @PostMapping("Criar")
    public ResponseEntity<AvaliacaoServicoResponseDTO> CriarAvaliacao(@RequestBody AvaliacaoServicoRequestDTO requestDTO) {
        AvaliacaoServicoResponseDTO createdAvaliacao = service.create(requestDTO);
        return ResponseEntity.status(201).body(createdAvaliacao);
    }

    @GetMapping("/{servicoId}")
    public ResponseEntity<List<AvaliacaoServicoResponseDTO>> listarAvaliacoesPorServico(
            @PathVariable Long servicoId) {
        return ResponseEntity.ok(service.buscarAvaliacoesPorServico(servicoId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAvaliacao(@PathVariable Long id) {
        service.deletarAvaliacao(id);
        return ResponseEntity.noContent().build();
    }


}