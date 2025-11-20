package psg.facilitei.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import psg.facilitei.Entity.AvaliacaoTrabalhador;
import psg.facilitei.Repository.AvaliacaoTrabalhadorRepository;
import psg.facilitei.Repository.TrabalhadorRepository;
import psg.facilitei.Repository.ClienteRepository;
import psg.facilitei.Entity.Trabalhador;
import psg.facilitei.Entity.Cliente;
import psg.facilitei.DTO.TrabalhadorResponseDTO; // Se precisar retornar DTO

import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes-trabalhador") // URL corrigida para bater com o Front
public class AvaliacaoTrabalhadorController {

    @Autowired
    private AvaliacaoTrabalhadorRepository repository;
    @Autowired
    private TrabalhadorRepository trabalhadorRepository;
    @Autowired
    private ClienteRepository clienteRepository;

    // Criar Avaliação
    @PostMapping
    public ResponseEntity<AvaliacaoTrabalhador> criar(@RequestBody AvaliacaoTrabalhador obj) {
        // Nota: O Front envia IDs, você precisará buscar as entidades se o JSON vier apenas com IDs,
        // ou configurar o Jackson para aceitar IDs no lugar de objetos.
        // Simplificando assumindo que o front manda o objeto estruturado ou você trata aqui:
        
        // Ajuste rápido para evitar erro de entidade desconectada se vier apenas ID no JSON:
        if(obj.getTrabalhador() != null && obj.getTrabalhador().getId() != null) {
             Trabalhador t = trabalhadorRepository.findById(obj.getTrabalhador().getId()).orElse(null);
             obj.setTrabalhador(t);
        }
        
        return ResponseEntity.ok(repository.save(obj));
    }

    // Listar por Trabalhador (Usado no Perfil do Trabalhador)
    // O frontend chama: /api/avaliacoes-cliente/trabalhador/{id} ??
    // ATENÇÃO: No seu front (TrabalhadorProfilePage), você chama: 
    // get<AvaliacaoTrabalhador[]>(`/avaliacoes-cliente/trabalhador/${workerId}`);
    // Isso parece um ERRO NO FRONTEND (chamando avaliacao-cliente para buscar avaliacao-trabalhador).
    // Se você corrigir o front para /api/avaliacoes-trabalhador, use este método:
    
    @GetMapping
    public ResponseEntity<List<AvaliacaoTrabalhador>> listar(@RequestParam Long trabalhadorId) {
        // Você precisará criar findByTrabalhadorId no Repository de AvaliacaoTrabalhador
        // return ResponseEntity.ok(repository.findByTrabalhadorId(trabalhadorId));
        return ResponseEntity.ok(repository.findAll()); // Placeholder temporário
    }
}