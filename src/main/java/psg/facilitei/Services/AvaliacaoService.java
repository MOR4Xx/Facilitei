// mor4xx/facilitei/Facilitei-d427a563d4621b17bc84b9d2a9232fff512c93a8/src/main/java/psg/facilitei/Services/AvaliacaoService.java
package psg.facilitei.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import psg.facilitei.DTO.*;
import psg.facilitei.Entity.*;
import psg.facilitei.Exceptions.ResourceNotFoundException;
import psg.facilitei.Repository.*;

@Service
public class AvaliacaoService {

    private final TrabalhadorService trabalhadorService;
    private final ClienteService clienteService;
    private final ServicoService servicoService;
    private final AvaliacaoServicoRepository avaliacaoServicoRepo;
    private final AvaliacaoClienteRepository avaliacaoClienteRepo;
    private final AvaliacaoTrabalhadorRepository avaliacaoTrabalhadorRepo;

    // Constructor injection
    public AvaliacaoService(TrabalhadorService trabalhadorService, ClienteService clienteService,
                            ServicoService servicoService,
                            AvaliacaoServicoRepository avaliacaoServicoRepo,
                            AvaliacaoClienteRepository avaliacaoClienteRepo,
                            AvaliacaoTrabalhadorRepository avaliacaoTrabalhadorRepo) {
        this.trabalhadorService = trabalhadorService;
        this.clienteService = clienteService;
        this.servicoService = servicoService;
        this.avaliacaoServicoRepo = avaliacaoServicoRepo;
        this.avaliacaoClienteRepo = avaliacaoClienteRepo;
        this.avaliacaoTrabalhadorRepo = avaliacaoTrabalhadorRepo;
    }

    @Transactional
    public AvaliacaoServico avaliarServico(AvaliacaoServicoRequestDTO dto) {
        AvaliacaoServico avaliacao = new AvaliacaoServico();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setFotos(dto.getFotos());

        Cliente cliente = clienteService.buscarEntidadePorId(dto.getClienteId());
        avaliacao.setCliente(cliente);

        // Removed the problematic line: Servico servico = servicoService.buscarPorId(dto.getServicoId());
        // The next line already correctly fetches the Servico entity.
        Servico servicoEntity = servicoService.buscarEntidadePorId(dto.getServicoId());
        avaliacao.setServico(servicoEntity);

        return avaliacaoServicoRepo.save(avaliacao);
    }

    @Transactional
    public AvaliacaoCliente avaliarCliente(AvaliacaoClienteRequestDTO dto) {
        AvaliacaoCliente avaliacao = new AvaliacaoCliente();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setFotos(dto.getFotos());

        Trabalhador trabalhador = trabalhadorService.buscarEntidadePorId(dto.getTrabalhadorId());
        avaliacao.setTrabalhador(trabalhador);

        Cliente cliente = clienteService.buscarEntidadePorId(dto.getClienteId());
        avaliacao.setCliente(cliente);

        return avaliacaoClienteRepo.save(avaliacao);
    }

    @Transactional
    public AvaliacaoTrabalhador avaliarTrabalhador(AvaliacaoTrabalhadorRequestDTO dto) {
        AvaliacaoTrabalhador avaliacao = new AvaliacaoTrabalhador();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setFotos(dto.getFotos());

        Cliente cliente = clienteService.buscarEntidadePorId(dto.getClienteId());
        Trabalhador trabalhador = trabalhadorService.buscarEntidadePorId(dto.getTrabalhadorId());

        avaliacao.setCliente(cliente);
        avaliacao.setTrabalhador(trabalhador);

        return avaliacaoTrabalhadorRepo.save(avaliacao);
    }
}