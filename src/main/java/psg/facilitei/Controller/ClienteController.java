
package psg.facilitei.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import psg.facilitei.DTO.*;
import psg.facilitei.Exceptions.ErrorResponseDTO;
import psg.facilitei.Services.ClienteService;

import jakarta.validation.Valid;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/clientes")
@Tag(name = "Cliente", description = "Operações relacionadas à gestão de clientes")
public class ClienteController {

        @Autowired
        private ClienteService clienteService;

        private Logger logger = Logger.getLogger(ClienteController.class.getName());

        @Operation(summary = "Cria um novo cliente", description = "Cria um novo cliente", responses = {
                        @ApiResponse(responseCode = "201", description = "Cliente criada com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ClienteResponseDTO.class))),
                        @ApiResponse(responseCode = "400", description = "Requisição inválida.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDTO.class))),
                        @ApiResponse(responseCode = "500", description = "Erro interno do servidor.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDTO.class)))
        })
        @PostMapping(consumes = "application/json", produces = "application/json")
        public ResponseEntity<ClienteResponseDTO> create(@Valid @RequestBody ClienteRequestDTO dto) {
                logger.info("Criando cliente");
                return ResponseEntity.ok(clienteService.create(dto));
        }

        @GetMapping(value = "/id/{id}", produces = "application/json")
        @Operation(summary = "Busca um cliente por ID", description = "Busca um cliente por ID", responses = {
                        @ApiResponse(responseCode = "200", description = "Cliente encontrado.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ClienteResponseDTO.class))),
                        @ApiResponse(responseCode = "404", description = "Cliente não encontrado."),
                        @ApiResponse(responseCode = "500", description = "Erro interno do servidor.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDTO.class)))
        })
        public ResponseEntity<EntityModel<ClienteResponseDTO>> getById(@PathVariable Long id) {
                logger.info("Buscando cliente por ID");
                return ResponseEntity.ok(clienteService.findById(id));
        }

        @GetMapping(value = "/avaliacoes/{id}", produces = "application/json")
        @Operation(summary = "Busca avaliações feitas ao cliente", description = "Busca as avaliações feitas ao cliente", responses = {
                        @ApiResponse(responseCode = "200", description = "Avaliações encontradas.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = AvaliacaoClienteResponseDTO.class))),
                        @ApiResponse(responseCode = "404", description = "Avaliações não encontradas."),
                        @ApiResponse(responseCode = "500", description = "Erro interno do servidor.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDTO.class)))
        })
        public ResponseEntity<List<AvaliacaoClienteResponseDTO>> getAvaliacoes(@PathVariable Long id) {
                logger.info("Buscando Avaliações que o cliente " + id + " recebeu");
                return ResponseEntity.ok(clienteService.getAvaliacoes(id));
        }

        @GetMapping(value = "/avaliacaoservico/{id}", produces = "application/json")
        @Operation(summary = "Busca avaliações feitas aos serviços contratados", description = "Busca as avaliações feitas do cliente aos serviços", responses = {
                        @ApiResponse(responseCode = "200", description = "Avaliações encontradas.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = AvaliacaoServicoResponseDTO.class))),
                        @ApiResponse(responseCode = "404", description = "Avaliações não encontradas."),
                        @ApiResponse(responseCode = "500", description = "Erro interno do servidor.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDTO.class)))
        })
        public ResponseEntity<List<AvaliacaoServicoResponseDTO>> getAvaliacoesServico(@PathVariable Long id) {
                logger.info("Busca avaliações que o cliente " + id + " fez para os serviços");
                return ResponseEntity.ok(clienteService.getAvaliacoesServico(id));
        }

        @PutMapping(value = "/editar/{id}", consumes = "application/json", produces = "application/json")
        @Operation(summary = "Edita os dados do cliente", description = "Edita os dados do cliente sem que seja modificado completamente", responses = {
                        @ApiResponse(responseCode = "200", description = "Cliente atualizado com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ClienteResponseDTO.class))),
                        @ApiResponse(responseCode = "404", description = "Cliente não encontrado para edição"),
                        @ApiResponse(responseCode = "500", description = "Erro interno do servidor.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDTO.class)))
        })
        public ResponseEntity<ClienteResponseDTO> editar(@PathVariable Long id,
                        @Valid @RequestBody ClienteRequestDTO dto) {
                logger.info("Editando cliente");
                return clienteService.update(id, dto);
        }

        @DeleteMapping(value = "/delete/{id}", produces = "application/json")
        @Operation(summary = "Deleta um cliente", description = "Remove um cliente pelo ID", responses = {
                        @ApiResponse(responseCode = "204", description = "Cliente deletado com sucesso."),
                        @ApiResponse(responseCode = "404", description = "Cliente não encontrado."),
                        @ApiResponse(responseCode = "500", description = "Erro interno do servidor.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDTO.class)))
        })
        public ResponseEntity<Void> deletar(@PathVariable Long id) {
                logger.info("Deletando cliente");
                clienteService.delete(id);
                return ResponseEntity.noContent().build();
        }
}