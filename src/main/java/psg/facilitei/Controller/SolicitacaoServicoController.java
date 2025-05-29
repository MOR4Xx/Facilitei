package psg.facilitei.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import psg.facilitei.DTO.SolicitacaoServicoRequestDTO;
import psg.facilitei.DTO.SolicitacaoServicoResponseDTO;
import psg.facilitei.Services.SolicitacaoServicoService;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes-servico")
public class SolicitacaoServicoController {

    @Autowired
    private SolicitacaoServicoService solicitacaoServicoService;

    @GetMapping
    public ResponseEntity<List<SolicitacaoServicoResponseDTO>> listarTodos() {
        List<SolicitacaoServicoResponseDTO> lista = solicitacaoServicoService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoServicoResponseDTO> buscarPorId(@PathVariable Long id) {
        SolicitacaoServicoResponseDTO solicitacao = solicitacaoServicoService.buscarPorId(id);
        return ResponseEntity.ok(solicitacao);
    }

    @PostMapping
    public ResponseEntity<SolicitacaoServicoResponseDTO> criar(@RequestBody SolicitacaoServicoRequestDTO dto) {
        SolicitacaoServicoResponseDTO criada = solicitacaoServicoService.criar(dto);
        return ResponseEntity.ok(criada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SolicitacaoServicoResponseDTO> atualizar(@PathVariable Long id, @RequestBody SolicitacaoServicoRequestDTO dto) {
        SolicitacaoServicoResponseDTO atualizada = solicitacaoServicoService.atualizar(id, dto);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        solicitacaoServicoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
