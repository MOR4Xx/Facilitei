// mor4xx/facilitei/Facilitei-d427a563d4621b17bc84b9d2a9232fff512c93a8/src/main/java/psg/facilitei/Controller/TrabalhadorController.java
package psg.facilitei.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.Valid;
import psg.facilitei.DTO.TrabalhadorRequestDTO;
import psg.facilitei.DTO.TrabalhadorResponseDTO;
import psg.facilitei.Services.TrabalhadorService;
import psg.facilitei.Exceptions.ErrorResponseDTO; // Added for error response schemas

@RestController
@RequestMapping("/trabalhador")
@Tag(name = "Trabalhador", description = "Operações relacionadas aos trabalhadores")
public class TrabalhadorController {

    @Autowired
    private TrabalhadorService service;

    @Operation(summary = "Cria um novo trabalhador", description = "Registra um trabalhador no sistema com os dados fornecidos.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Trabalhador criado com sucesso",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TrabalhadorResponseDTO.class))), // Changed to ResponseDTO
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou incompletos",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class))) // Added ErrorResponseDTO
    })
    @PostMapping("/criar")
    public ResponseEntity<TrabalhadorResponseDTO> CreateTrabalhador(@Valid @RequestBody TrabalhadorRequestDTO trabalhadorRequestDTO) { // Changed return type to ResponseEntity<TrabalhadorResponseDTO> and added @Valid
        TrabalhadorResponseDTO createdTrabalhador = service.createTrabalhador(trabalhadorRequestDTO);
        return ResponseEntity.status(201).body(createdTrabalhador);
    }

    @Operation(summary = "Lista todos os trabalhadores", description = "Retorna uma lista com todos os trabalhadores cadastrados no sistema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TrabalhadorResponseDTO.class)))
    })
    @GetMapping("/listar")
    public List<TrabalhadorResponseDTO> listarTodos() {
        return service.findAll();
    }

    @Operation(summary = "Atualiza um trabalhador existente", description = "Atualiza os dados de um trabalhador com base no ID fornecido.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Trabalhador atualizado com sucesso",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TrabalhadorResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Trabalhador não encontrado"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class))) // Added ErrorResponseDTO
    })
    @PutMapping("/atualizar/{id}")
    public TrabalhadorResponseDTO atualizarTrabalhador(@PathVariable Long id, @Valid @RequestBody TrabalhadorRequestDTO dto) { // Added @Valid
        return service.atualizar(id, dto);
    }

    @Operation(summary = "Deleta um trabalhador", description = "Remove um trabalhador do sistema com base no ID fornecido.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Trabalhador deletado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Trabalhador não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class))) // Added ErrorResponseDTO
    })
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletarTrabalhador(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Buscar trabalhador por ID",
            description = "Retorna os dados de um trabalhador específico com base no ID fornecido."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Trabalhador encontrado com sucesso",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TrabalhadorResponseDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "Trabalhador não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDTO.class))) // Added ErrorResponseDTO
    })
    @GetMapping("buscarPorId/{id}")
    public ResponseEntity<TrabalhadorResponseDTO> buscarPorId(@PathVariable Long id) {
        TrabalhadorResponseDTO dto = service.findById(id);
        return ResponseEntity.ok(dto);
    }
}