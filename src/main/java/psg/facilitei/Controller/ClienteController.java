package psg.facilitei.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import psg.facilitei.DTO.ClienteRequestDTO;
import psg.facilitei.DTO.ClienteResponseDTO;
import psg.facilitei.Exceptions.ErrorResponseDTO;
import psg.facilitei.Services.ClienteService;

import java.util.logging.Logger;

@RestController
@RequestMapping("/clientes")
@Tag(name = "Cliente", description = "Operações relacionadas à gestão de clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    private Logger logger = Logger.getLogger(ClienteController.class.getName());

    @Operation(summary = "Cria um novo cliente", description = "Cria um novo cliente",
            responses = {@ApiResponse(responseCode = "201", description = "Cliente criada com sucesso."),
                    @ApiResponse(responseCode = "400", description = "Requisição inválida.",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ClienteRequestDTO.class))),
                    @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponseDTO.class)))
            })
    @PostMapping(value = "/create", consumes = "application/json", produces = "application/json")
    public ResponseEntity<ClienteResponseDTO> create(ClienteRequestDTO dto) {
        logger.info("Criando cliente");

        return ResponseEntity.ok(clienteService.create(dto));
    }

    @GetMapping(value = "/{id}", produces = "application/json")
    @Operation(summary = "Busca um cliente por ID", description = "Busca um cliente por ID",
            responses = {@ApiResponse(responseCode = "200", description = "Cliente encontrado."),
                    @ApiResponse(responseCode = "404", description = "Cliente não encontrado."),
                    @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponseDTO.class)))
            })
    public ResponseEntity<ClienteResponseDTO> getById(Long id) {
        logger.info("Buscando cliente por ID");

        return ResponseEntity.ok(clienteService.findById(id));
    }

}
