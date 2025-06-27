package psg.facilitei.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import psg.facilitei.DTO.*;
import psg.facilitei.Entity.*;
import psg.facilitei.Services.AvaliacaoService;

@RestController
@RequestMapping("/api/avaliacoes")
@Tag(name = "Avaliações", description = "Endpoints relacionados às avaliações de serviço, cliente e trabalhador")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

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
}
