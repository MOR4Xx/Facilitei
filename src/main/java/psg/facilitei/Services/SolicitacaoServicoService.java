package psg.facilitei.Services;

import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import psg.facilitei.DTO.SolicitacaoServicoRequestDTO;
import psg.facilitei.DTO.SolicitacaoServicoResponseDTO;
import psg.facilitei.Entity.SolicitacaoServico;
import psg.facilitei.Exceptions.BusinessRuleException;
import psg.facilitei.Exceptions.ResourceNotFoundException;
import psg.facilitei.Repository.SolicitacaoServicoRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SolicitacaoServicoService {

    @Autowired
    private  SolicitacaoServicoRepository repository;

    @Autowired
    private  ModelMapper modelMapper;

    @Transactional
    public List<SolicitacaoServicoResponseDTO> listarTodos() {
        List<SolicitacaoServico> entidades = repository.findAll();
        return entidades.stream()
                .map(e -> modelMapper.map(e, SolicitacaoServicoResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public SolicitacaoServicoResponseDTO buscarPorId(Long id) {
        SolicitacaoServico entidade = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação de serviço não encontrada com ID: " + id));
        return modelMapper.map(entidade, SolicitacaoServicoResponseDTO.class);
    }

    @Transactional
    public SolicitacaoServicoResponseDTO criar(SolicitacaoServicoRequestDTO dto) {
        SolicitacaoServico novaSolicitacao = modelMapper.map(dto, SolicitacaoServico.class);

        if (novaSolicitacao.getDataSolicitacao() == null) {
            throw new BusinessRuleException("A data da solicitação é obrigatória.");
        }

        SolicitacaoServico salvo = repository.save(novaSolicitacao);
        return modelMapper.map(salvo, SolicitacaoServicoResponseDTO.class);
    }

    @Transactional
    public SolicitacaoServicoResponseDTO atualizar(Long id, SolicitacaoServicoRequestDTO dto) {
        Optional<SolicitacaoServico> existente = repository.findById(id);
        if (existente.isEmpty()) {
            throw new ResourceNotFoundException("Solicitação de serviço não encontrada para atualizar.");
        }

        SolicitacaoServico entidadeAtualizada = modelMapper.map(dto, SolicitacaoServico.class);
        entidadeAtualizada.setId(id);

        SolicitacaoServico salvo = repository.save(entidadeAtualizada);
        return modelMapper.map(salvo, SolicitacaoServicoResponseDTO.class);
    }

    @Transactional
    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Solicitação de serviço não encontrada para exclusão.");
        }
        repository.deleteById(id);
    }
}
