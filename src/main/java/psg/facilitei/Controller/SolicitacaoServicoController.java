
package psg.facilitei.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import psg.facilitei.DTO.SolicitacaoServicoRequestDTO;
import psg.facilitei.DTO.SolicitacaoServicoResponseDTO;
import psg.facilitei.Services.SolicitacaoServicoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes-servico")
@Tag(name = "Solicitação de Serviço", description = "Operações relacionadas à gestão de solicitações de serviço")
public class SolicitacaoServicoController {

    @Autowired
    private SolicitacaoServicoService solicitacaoServicoService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Lista todas as solicitações de serviço",
               responses = {
                   @ApiResponse(responseCode = "200", description = "Lista de solicitações de serviço retornada com sucesso",
                                content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = SolicitacaoServicoResponseDTO.class))),
                   @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
               })
    public ResponseEntity<List<SolicitacaoServicoResponseDTO>> listarTodos() {
        List<SolicitacaoServicoResponseDTO> lista = solicitacaoServicoService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Busca uma solicitação de serviço por ID",
               responses = {
                   @ApiResponse(responseCode = "200", description = "Solicitação de serviço encontrada com sucesso",
                                content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = SolicitacaoServicoResponseDTO.class))),
                   @ApiResponse(responseCode = "404", description = "Solicitação de serviço não encontrada"),
                   @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
               })
    public ResponseEntity<SolicitacaoServicoResponseDTO> buscarPorId(@PathVariable Long id) {
        SolicitacaoServicoResponseDTO solicitacao = solicitacaoServicoService.buscarPorId(id);
        return ResponseEntity.ok(solicitacao);
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Cria uma nova solicitação de serviço",
               responses = {
                   @ApiResponse(responseCode = "201", description = "Solicitação de serviço criada com sucesso",
                                content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = SolicitacaoServicoResponseDTO.class))),
                   @ApiResponse(responseCode = "400", description = "Requisição inválida"),
                   @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
               })
    public ResponseEntity<SolicitacaoServicoResponseDTO> criar(@Valid @RequestBody SolicitacaoServicoRequestDTO dto) {
        SolicitacaoServicoResponseDTO criada = solicitacaoServicoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Atualiza uma solicitação de serviço existente",
               responses = {
                   @ApiResponse(responseCode = "200", description = "Solicitação de serviço atualizada com sucesso",
                                content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = SolicitacaoServicoResponseDTO.class))),
                   @ApiResponse(responseCode = "400", description = "Requisição inválida"),
                   @ApiResponse(responseCode = "404", description = "Solicitação de serviço não encontrada"),
                   @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
               })
    public ResponseEntity<SolicitacaoServicoResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody SolicitacaoServicoRequestDTO dto) {
        SolicitacaoServicoResponseDTO atualizada = solicitacaoServicoService.atualizar(id, dto);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deleta uma solicitação de serviço por ID",
               responses = {
                   @ApiResponse(responseCode = "204", description = "Solicitação de serviço deletada com sucesso"),
                   @ApiResponse(responseCode = "404", description = "Solicitação de serviço não encontrada"),
                   @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
               })
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        solicitacaoServicoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}