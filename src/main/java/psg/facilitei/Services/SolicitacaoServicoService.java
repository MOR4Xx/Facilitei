package psg.facilitei.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import psg.facilitei.Entities.SolicitacaoServico;
import psg.facilitei.Repository.SolicitacaoServicoRepository;

@Service
public class SolicitacaoServicoService {

    @Autowired
    private SolicitacaoServicoRepository solicitacaoServicoRepository;

    
}
