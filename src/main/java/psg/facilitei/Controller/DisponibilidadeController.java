// mor4xx/facilitei/Facilitei-d427a563d4621b17bc84b9d2a9232fff512c93a8/src/main/java/psg/facilitei/Controller/DisponibilidadeController.java
package psg.facilitei.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import psg.facilitei.DTO.DisponibilidadeRequestDTO;
import psg.facilitei.DTO.DisponibilidadeResponseDTO;
import psg.facilitei.Services.DisponibilidadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid; // Added for DTO validation

import java.util.List;

@RestController
@RequestMapping("/api/disponibilidades")
@Tag(name = "Disponibilidade", description = "Operações relacionadas à gestão de disponibilidades")
public class DisponibilidadeController {

    @Autowired
    private DisponibilidadeService disponibilidadeService;

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Cria uma nova disponibilidade",
               responses = {
                   @ApiResponse(responseCode = "201", description = "Disponibilidade criada com sucesso",
                                content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = DisponibilidadeResponseDTO.class))),
                   @ApiResponse(responseCode = "400", description = "Requisição inválida"),
                   @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
               })
    public ResponseEntity<DisponibilidadeResponseDTO> criarDisponibilidade(@Valid @RequestBody DisponibilidadeRequestDTO dto) { // Added @Valid
        DisponibilidadeResponseDTO created = disponibilidadeService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Lista todas as disponibilidades",
               responses = {
                   @ApiResponse(responseCode = "200", description = "Lista de disponibilidades retornada com sucesso",
                                content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = DisponibilidadeResponseDTO.class))),
                   @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
               })
    public ResponseEntity<List<DisponibilidadeResponseDTO>> listarDisponibilidades() {
        List<DisponibilidadeResponseDTO> lista = disponibilidadeService.getAll();
        return ResponseEntity.ok(lista);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Busca uma disponibilidade por ID",
               responses = {
                   @ApiResponse(responseCode = "200", description = "Disponibilidade encontrada com sucesso",
                                content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = DisponibilidadeResponseDTO.class))),
                   @ApiResponse(responseCode = "404", description = "Disponibilidade não encontrada"),
                   @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
               })
    public ResponseEntity<DisponibilidadeResponseDTO> buscarPorId(@PathVariable Long id) {
        DisponibilidadeResponseDTO disponibilidade = disponibilidadeService.getById(id);
        return ResponseEntity.ok(disponibilidade);
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Atualiza uma disponibilidade existente",
               responses = {
                   @ApiResponse(responseCode = "200", description = "Disponibilidade atualizada com sucesso",
                                content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = DisponibilidadeResponseDTO.class))),
                   @ApiResponse(responseCode = "400", description = "Requisição inválida"),
                   @ApiResponse(responseCode = "404", description = "Disponibilidade não encontrada"),
                   @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
               })
    public ResponseEntity<DisponibilidadeResponseDTO> atualizarDisponibilidade(@PathVariable Long id, @Valid @RequestBody DisponibilidadeRequestDTO dto) { // Added @Valid
        DisponibilidadeResponseDTO updated = disponibilidadeService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deleta uma disponibilidade por ID",
               responses = {
                   @ApiResponse(responseCode = "204", description = "Disponibilidade deletada com sucesso"),
                   @ApiResponse(responseCode = "404", description = "Disponibilidade não encontrada"),
                   @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
               })
    public ResponseEntity<Void> deletarDisponibilidade(@PathVariable Long id) {
        disponibilidadeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}