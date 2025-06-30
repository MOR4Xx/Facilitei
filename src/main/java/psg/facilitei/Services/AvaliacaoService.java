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

    private final TrabalhadorService trabalhadorService;
    private final ClienteService clienteService;
    private final AvaliacaoServicoRepository avaliacaoServicoRepo;
    private final AvaliacaoClienteRepository avaliacaoClienteRepo;
    private final AvaliacaoTrabalhadorRepository avaliacaoTrabalhadorRepo;

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

    public AvaliacaoServico avaliarServico(AvaliacaoServicoRequestDTO dto) {
        AvaliacaoServico avaliacao = new AvaliacaoServico();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());

        Cliente cliente = clienteService.buscarEntidadePorId(dto.getClienteId());
        avaliacao.setCliente(cliente);

        return avaliacaoServicoRepo.save(avaliacao);
    }

    public AvaliacaoCliente avaliarCliente(AvaliacaoClienteRequestDTO dto) {
        AvaliacaoCliente avaliacao = new AvaliacaoCliente();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setFotos(dto.getFotos());

        Trabalhador trabalhador = trabalhadorService.buscarEntidadePorId(dto.getTrabalhadorId());
        avaliacao.setTrabalhador(trabalhador);

        return avaliacaoClienteRepo.save(avaliacao);
    }

    public AvaliacaoTrabalhador avaliarTrabalhador(AvaliacaoTrabalhadorRequestDTO dto) {
        AvaliacaoTrabalhador avaliacao = new AvaliacaoTrabalhador();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario() != null ? dto.getComentario() : "");
        avaliacao.setFotos(dto.getFotos());

        Cliente cliente = clienteService.buscarEntidadePorId(dto.getClienteId());
        Trabalhador trabalhador = trabalhadorService.buscarEntidadePorId(dto.getTrabalhadorId());

        avaliacao.setCliente(cliente);
        avaliacao.setTrabalhador(trabalhador);

        return avaliacaoTrabalhadorRepo.save(avaliacao);
    }
}


