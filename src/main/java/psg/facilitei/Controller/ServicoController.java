package psg.facilitei.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import psg.facilitei.DTO.ServicoRequestDTO;
import psg.facilitei.DTO.ServicoResponseDTO;
import psg.facilitei.Services.ServicoService;

import java.util.List;

@RestController
@RequestMapping("/api/servicos")
public class ServicoController {

    @Autowired
    private ServicoService servicoService;


    @GetMapping
    public ResponseEntity<List<ServicoResponseDTO>> listarTodos() {
        List<ServicoResponseDTO> lista = servicoService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicoResponseDTO> buscarPorId(@PathVariable Long id) {
        ServicoResponseDTO servico = servicoService.buscarPorId(id);
        return ResponseEntity.ok(servico);
    }

    
    @PostMapping
    public ResponseEntity<ServicoResponseDTO> criar(@RequestBody ServicoRequestDTO dto) {
        ServicoResponseDTO criado = servicoService.criar(dto);
        return ResponseEntity.ok(criado);
    }


    @PutMapping("/{id}")
    public ResponseEntity<ServicoResponseDTO> atualizar(@PathVariable Long id, @RequestBody ServicoRequestDTO dto) {
        ServicoResponseDTO atualizado = servicoService.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

   
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        servicoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
