package psg.facilitei.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import psg.facilitei.DTO.DisponibilidadeRequestDTO;
import psg.facilitei.DTO.DisponibilidadeResponseDTO;
import psg.facilitei.Services.DisponibilidadeService;

import java.util.List;

@RestController
@RequestMapping("/api/disponibilidades")
public class DisponibilidadeController {

    @Autowired
    private DisponibilidadeService disponibilidadeService;

    @PostMapping
    public ResponseEntity<DisponibilidadeResponseDTO> criarDisponibilidade(@RequestBody DisponibilidadeRequestDTO dto) {
        DisponibilidadeResponseDTO created = disponibilidadeService.create(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<DisponibilidadeResponseDTO>> listarDisponibilidades() {
        List<DisponibilidadeResponseDTO> lista = disponibilidadeService.getAll();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisponibilidadeResponseDTO> buscarPorId(@PathVariable Long id) {
        DisponibilidadeResponseDTO disponibilidade = disponibilidadeService.getById(id);
        return ResponseEntity.ok(disponibilidade);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DisponibilidadeResponseDTO> atualizarDisponibilidade(
            @PathVariable Long id,
            @RequestBody DisponibilidadeRequestDTO dto) {
        DisponibilidadeResponseDTO updated = disponibilidadeService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarDisponibilidade(@PathVariable Long id) {
        disponibilidadeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
