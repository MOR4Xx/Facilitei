package psg.facilitei.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import psg.facilitei.Controller.domain.ChatInput;
import psg.facilitei.Entity.Mensagem;
import psg.facilitei.Repository.MensagemRepository;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/chat") // Endpoint REST para histórico
public class LiveChatController {

    @Autowired
    private MensagemRepository mensagemRepository;

    // 1. Endpoint para enviar mensagem via WebSocket
    // O cliente manda para: /app/chat/{servicoId}
    // O servidor distribui para quem ouve: /topics/chat/{servicoId}
    @MessageMapping("/chat/{servicoId}")
    @SendTo("/topics/chat/{servicoId}")
    public Mensagem sendMessage(@DestinationVariable Long servicoId, ChatInput input) {
        
        // Salva no banco (Persistência)
        Mensagem msg = new Mensagem();
        msg.setServicoId(servicoId);
        msg.setRemetente(input.user());
        msg.setConteudo(input.message());
        msg.setTipo(input.type() != null ? input.type() : "TEXTO");
        msg.setUrlArquivo(input.fileUrl());
        msg.setDataEnvio(LocalDateTime.now());
        
        return mensagemRepository.save(msg);
    }

    // 2. Endpoint REST para carregar histórico quando abrir a tela
    @GetMapping("/historico/{servicoId}")
    public ResponseEntity<List<Mensagem>> getHistorico(@PathVariable Long servicoId) {
        return ResponseEntity.ok(mensagemRepository.findByServicoIdOrderByDataEnvioAsc(servicoId));
    }
}