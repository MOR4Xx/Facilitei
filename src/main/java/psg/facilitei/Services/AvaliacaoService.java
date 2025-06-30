package psg.facilitei.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import psg.facilitei.DTO.*;
import psg.facilitei.Entity.*;
import psg.facilitei.Repository.*;

import java.util.Optional;
import org.springframework.stereotype.Component;

@Service
public class AvaliacaoService {

    public AvaliacaoService(TrabalhadorService trabalhadorService, ClienteService clienteService,
                            AvaliacaoServicoRepository avaliacaoServicoRepo,
                            AvaliacaoClienteRepository avaliacaoClienteRepo,
                            AvaliacaoTrabalhadorRepository avaliacaoTrabalhadorRepo) {
        this.trabalhadorService = trabalhadorService;
        this.clienteService = clienteService;
        this.avaliacaoServicoRepo = avaliacaoServicoRepo;
        this.avaliacaoClienteRepo = avaliacaoClienteRepo;
        this.avaliacaoTrabalhadorRepo = avaliacaoTrabalhadorRepo;
    }

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private AvaliacaoServicoRepository avaliacaoServicoRepo;

    @Autowired
    private AvaliacaoClienteRepository avaliacaoClienteRepo;

    @Autowired
    private AvaliacaoTrabalhadorRepository avaliacaoTrabalhadorRepo;

    @Autowired
    private final TrabalhadorService trabalhadorService;

    public AvaliacaoServico avaliarServico(AvaliacaoServicoRequestDTO dto) {
        AvaliacaoServico avaliacao = new AvaliacaoServico();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        // Ensure AvaliacaoCliente has a fotos field and a corresponding setter
        Cliente cliente;
        if (clienteService.findById(dto.getClienteId()) != null) {
            cliente = new Cliente();
        } else {
            throw new RuntimeException("Cliente não encontrado com ID: " + dto.getClienteId());
        }
        avaliacao.setCliente(cliente);;
        return avaliacaoServicoRepo.save(avaliacao);
    }

    public AvaliacaoCliente avaliarCliente(AvaliacaoClienteRequestDTO dto) {
        AvaliacaoCliente avaliacao = new AvaliacaoCliente();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setFotos(dto.getFotos());
        Trabalhador trabalhador = null;
        if (trabalhadorService.findById(dto.getTrabalhadorId()) != null) {
            trabalhador = new Trabalhador();
            trabalhador.setId(dto.getTrabalhadorId());
        } else {
            throw new RuntimeException("Trabalhador não encontrado com ID: " + dto.getTrabalhadorId());
        }

        avaliacao.setTrabalhador(trabalhador);
        return avaliacaoClienteRepo.save(avaliacao);
    }

    public AvaliacaoTrabalhador avaliarTrabalhador(AvaliacaoTrabalhadorRequestDTO dto) {
        AvaliacaoTrabalhador avaliacao = new AvaliacaoTrabalhador();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setFotos(dto.getFotos());
        Cliente cliente;
        if (clienteService.findById(dto.getClienteId()) != null) {
            cliente = new Cliente();
        } else {
            throw new RuntimeException("Cliente não encontrado com ID: " + dto.getClienteId());
        }

        avaliacao.setCliente(cliente);
        Trabalhador trabalhador = new Trabalhador();
        trabalhador.setId(dto.getTrabalhadorId());
        avaliacao.setTrabalhador(trabalhador);
        return avaliacaoTrabalhadorRepo.save(avaliacao);
    }
}

