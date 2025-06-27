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

    @Transactional
    public AvaliacaoServico avaliarServico(AvaliacaoServicoRequestDTO dto) {
        AvaliacaoServico avaliacao = new AvaliacaoServico();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setFotos(dto.getFotos());
        avaliacao.setClienteId(dto.getClienteId());
        avaliacao.setServicoId(dto.getServicoId());
        return avaliacaoServicoRepo.save(avaliacao);
    }

    @Transactional
    public AvaliacaoCliente avaliarCliente(AvaliacaoClienteRequestDTO dto) {
        AvaliacaoCliente avaliacao = new AvaliacaoCliente();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setFotos(dto.getFotos());
        avaliacao.setClienteId(dto.getClienteId());
        avaliacao.setTrabalhadorId(dto.getTrabalhadorId());
        return avaliacaoClienteRepo.save(avaliacao);
    }

    @Transactional
    public AvaliacaoTrabalhador avaliarTrabalhador(AvaliacaoTrabalhadorRequestDTO dto) {
        AvaliacaoTrabalhador avaliacao = new AvaliacaoTrabalhador();
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setFotos(dto.getFotos());
        avaliacao.setClienteId(dto.getClienteId());
        avaliacao.setTrabalhadorId(dto.getTrabalhadorId());
        return avaliacaoTrabalhadorRepo.save(avaliacao);
    }
}
