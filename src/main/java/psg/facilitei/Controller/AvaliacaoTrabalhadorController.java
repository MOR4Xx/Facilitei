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
import psg.facilitei.DTO.AvaliacaoTrabalhadorRequestDTO;
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
    public ResponseEntity<AvaliacaoTrabalhador> criar(@RequestBody AvaliacaoTrabalhadorRequestDTO dto) {
        AvaliacaoTrabalhador avaliacao = new AvaliacaoTrabalhador();
        
        // Buscando as entidades pelos IDs do DTO
        Trabalhador t = trabalhadorRepository.findById(dto.getTrabalhadorId())
            .orElseThrow(() -> new RuntimeException("Trabalhador não encontrado"));
        Cliente c = clienteRepository.findById(dto.getClienteId())
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
            
        avaliacao.setTrabalhador(t);
        // avaliacao.setCliente(c); // Se tiver campo cliente na entidade AvaliacaoTrabalhador
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        // avaliacao.setServicoId(dto.getServicoId()); // Se tiver esse campo para rastreio
        
        return ResponseEntity.ok(repository.save(avaliacao));
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