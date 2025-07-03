// mor4xx/facilitei/Facilitei-d427a563d4621b17bc84b9d2a9232fff512c93a8/src/main/java/psg/facilitei/Controller/ServicoController.java
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

import jakarta.validation.Valid; // Added for DTO validation

import java.util.List;

@RestController
@RequestMapping("/api/servicos")
@Tag(name = "Serviço", description = "Operações relacionadas à gestão de serviços")
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Lista todos os serviços",
               responses = {
                   @ApiResponse(responseCode = "200", description = "Lista de serviços retornada com sucesso",
                                content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = ServicoResponseDTO.class))),
                   @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
               })
    public ResponseEntity<List<ServicoResponseDTO>> listarTodos() {
        List<ServicoResponseDTO> lista = servicoService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Busca um serviço por ID",
               responses = {
                   @ApiResponse(responseCode = "200", description = "Serviço encontrado com sucesso",
                                content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = ServicoResponseDTO.class))),
                   @ApiResponse(responseCode = "404", description = "Serviço não encontrado"),
                   @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
               })
    public ResponseEntity<ServicoResponseDTO> buscarPorId(@PathVariable Long id) {
        ServicoResponseDTO servico = servicoService.buscarPorId(id);
        return ResponseEntity.ok(servico);
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Cria um novo serviço",
               responses = {
                   @ApiResponse(responseCode = "201", description = "Serviço criado com sucesso",
                                content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = ServicoResponseDTO.class))), // Should be response DTO
                   @ApiResponse(responseCode = "400", description = "Requisição inválida"),
                   @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
               })
    public ResponseEntity<ServicoResponseDTO> criar(@Valid @RequestBody ServicoRequestDTO dto) { // Added @Valid
        ServicoResponseDTO criado = servicoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Atualiza um serviço existente",
               responses = {
                   @ApiResponse(responseCode = "200", description = "Serviço atualizado com sucesso",
                                content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = ServicoResponseDTO.class))), // Should be response DTO
                   @ApiResponse(responseCode = "400", description = "Requisição inválida"),
                   @ApiResponse(responseCode = "404", description = "Serviço não encontrado"),
                   @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
               })
    public ResponseEntity<ServicoResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody ServicoRequestDTO dto) { // Added @Valid
        ServicoResponseDTO atualizado = servicoService.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deleta um serviço por ID",
               responses = {
                   @ApiResponse(responseCode = "204", description = "Serviço deletado com sucesso"),
                   @ApiResponse(responseCode = "404", description = "Serviço não encontrado"),
                   @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
               })
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        servicoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}