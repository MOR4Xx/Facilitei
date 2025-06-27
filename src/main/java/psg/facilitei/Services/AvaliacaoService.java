package psg.facilitei.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import psg.facilitei.DTO.*;
import psg.facilitei.Entity.*;
import psg.facilitei.Repository.*;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoServicoRepository avaliacaoServicoRepo;

    @Autowired
    private AvaliacaoClienteRepository avaliacaoClienteRepo;

    @Autowired
    private AvaliacaoTrabalhadorRepository avaliacaoTrabalhadorRepo;

    @Autowired
    private ClienteRepository clienteRepo;

    @Autowired
    private ServicoRepository servicoRepo;

    @Autowired
    private TrabalhadorRepository trabalhadorRepo;

    @Transactional
    public AvaliacaoServico avaliarServico(AvaliacaoServicoRequestDTO dto) {
        Cliente cliente = clienteRepo.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        Servico servico = servicoRepo.findById(dto.getServicoId())
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        AvaliacaoServico avaliacao = new AvaliacaoServico();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setFotos(dto.getFotos());
        avaliacao.setAvaliador(cliente);
        avaliacao.setAvaliado(servico);

        return avaliacaoServicoRepo.save(avaliacao);
    }

    @Transactional
    public AvaliacaoCliente avaliarCliente(AvaliacaoClienteRequestDTO dto) {
        Trabalhador trabalhador = trabalhadorRepo.findById(dto.getTrabalhadorId())
                .orElseThrow(() -> new RuntimeException("Trabalhador não encontrado"));
        Cliente cliente = clienteRepo.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        AvaliacaoCliente avaliacao = new AvaliacaoCliente();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setFotos(dto.getFotos());
        avaliacao.setAvaliador(trabalhador);
        avaliacao.setAvaliado(cliente);

        return avaliacaoClienteRepo.save(avaliacao);
    }

    @Transactional
    public AvaliacaoTrabalhador avaliarTrabalhador(AvaliacaoTrabalhadorRequestDTO dto) {
        Cliente cliente = clienteRepo.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        Trabalhador trabalhador = trabalhadorRepo.findById(dto.getTrabalhadorId())
                .orElseThrow(() -> new RuntimeException("Trabalhador não encontrado"));

        AvaliacaoTrabalhador avaliacao = new AvaliacaoTrabalhador();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setFotos(dto.getFotos());
        avaliacao.setAvaliador(cliente);
        avaliacao.setAvaliado(trabalhador);

        return avaliacaoTrabalhadorRepo.save(avaliacao);
    }
}
