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
        
        Trabalhador t = trabalhadorRepository.findById(dto.getTrabalhadorId())
            .orElseThrow(() -> new RuntimeException("Trabalhador não encontrado"));
            
        Cliente c = clienteRepository.findById(dto.getClienteId())
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
            
        avaliacao.setTrabalhador(t);
        avaliacao.setCliente(c); // AGORA O CLIENTE É SALVO CORRETAMENTE
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        
        // Define a data atual se não vier do DTO
        avaliacao.setData(new java.util.Date()); 
        
        return ResponseEntity.ok(repository.save(avaliacao));
    }

    @GetMapping
    public ResponseEntity<List<AvaliacaoTrabalhador>> listar(@RequestParam Long trabalhadorId) {
        // Nota: Você precisa criar o método findByTrabalhadorId no Repository se ainda não existir,
        // ou usar findAll() e filtrar (não recomendado para produção, mas funciona para teste)
        // return ResponseEntity.ok(repository.findByTrabalhadorId(trabalhadorId));
        
        // Temporário: Retorna tudo para não quebrar se o método customizado não existir no repo
        return ResponseEntity.ok(repository.findAll().stream()
            .filter(a -> a.getTrabalhador().getId().equals(trabalhadorId))
            .toList());
    }
}