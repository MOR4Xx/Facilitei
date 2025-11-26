package psg.facilitei.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import psg.facilitei.DTO.ServicoRequestDTO;
import psg.facilitei.DTO.ServicoResponseDTO;
import psg.facilitei.Services.ServicoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/servicos")
@Tag(name = "Serviço", description = "Operações relacionadas à gestão de serviços")
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Busca um serviço por ID", responses = {
            @ApiResponse(responseCode = "200", description = "Serviço encontrado com sucesso", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ServicoResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Serviço não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    public ResponseEntity<ServicoResponseDTO> buscarPorId(@PathVariable Long id) {
        ServicoResponseDTO servico = servicoService.buscarPorId(id);
        return ResponseEntity.ok(servico);
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Cria um novo serviço", responses = {
            @ApiResponse(responseCode = "201", description = "Serviço criado com sucesso", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ServicoResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    public ResponseEntity<ServicoResponseDTO> criar(@Valid @RequestBody ServicoRequestDTO dto) {
        ServicoResponseDTO criado = servicoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Atualiza um serviço existente", responses = {
            @ApiResponse(responseCode = "200", description = "Serviço atualizado com sucesso", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ServicoResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "404", description = "Serviço não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    public ResponseEntity<ServicoResponseDTO> atualizar(@PathVariable Long id,
            @Valid @RequestBody ServicoRequestDTO dto) {
        ServicoResponseDTO atualizado = servicoService.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deleta um serviço por ID", responses = {
            @ApiResponse(responseCode = "204", description = "Serviço deletado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Serviço não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        servicoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/por-cliente/{clienteId}")
    public ResponseEntity<List<ServicoResponseDTO>> listarPorCliente(@PathVariable Long clienteId) {
        // Você precisará criar este método no ServicoService também, chamando o
        // repository que editamos acima
        List<ServicoResponseDTO> servicos = servicoService.listarPorCliente(clienteId);
        return ResponseEntity.ok(servicos);
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ServicoResponseDTO>> listar(
            @RequestParam(required = false) Long trabalhadorId,
            @RequestParam(required = false) Long clienteId) {

        List<ServicoResponseDTO> lista;

        if (trabalhadorId != null) {
            // Você precisará criar findByTrabalhadorId no Repository e Service
            // Aqui estou simulando o retorno filtrado
            lista = servicoService.listarPorTrabalhador(trabalhadorId);
        } else if (clienteId != null) {
            lista = servicoService.listarPorCliente(clienteId);
        } else {
            lista = servicoService.listarTodos();
        }
        return ResponseEntity.ok(lista);
    }
}