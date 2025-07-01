package psg.facilitei.Services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import psg.facilitei.DTO.SolicitacaoServicoRequestDTO;
import psg.facilitei.DTO.SolicitacaoServicoResponseDTO;
import psg.facilitei.Entity.Cliente;
import psg.facilitei.Entity.Servico;
import psg.facilitei.Entity.SolicitacaoServico;
import psg.facilitei.Entity.Enum.StatusSolicitacao;
import psg.facilitei.Exceptions.ResourceNotFoundException;

import psg.facilitei.Repository.SolicitacaoServicoRepository;
import psg.facilitei.Repository.ServicoRepository; 

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitacaoServicoService {

    @Autowired
    private SolicitacaoServicoRepository solicitacaoServicoRepository;

    @Autowired
    private ClienteService clienteService; 

    @Autowired
    private ServicoRepository servicoRepository; 

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public SolicitacaoServicoResponseDTO criar(SolicitacaoServicoRequestDTO dto) {
        SolicitacaoServico solicitacao = modelMapper.map(dto, SolicitacaoServico.class);

        Cliente cliente = clienteService.buscarEntidadePorId(dto.getClienteId());
        solicitacao.setCliente(cliente);

        Servico servico = servicoRepository.findById(dto.getServicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado com ID: " + dto.getServicoId()));
        solicitacao.setServico(servico);

        solicitacao.setDataSolicitacao(LocalDateTime.now());

        if (solicitacao.getStatusSolicitacao() == null) {
            solicitacao.setStatusSolicitacao(StatusSolicitacao.PENDENTE);
        }

        SolicitacaoServico salvo = solicitacaoServicoRepository.save(solicitacao);
        return modelMapper.map(salvo, SolicitacaoServicoResponseDTO.class);
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoServicoResponseDTO> listarTodos() {
        return solicitacaoServicoRepository.findAll()
                .stream()
                .map(solicitacao -> modelMapper.map(solicitacao, SolicitacaoServicoResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SolicitacaoServicoResponseDTO buscarPorId(Long id) {
        SolicitacaoServico solicitacao = solicitacaoServicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação de Serviço não encontrada com ID: " + id));
        return modelMapper.map(solicitacao, SolicitacaoServicoResponseDTO.class);
    }

    @Transactional
    public SolicitacaoServicoResponseDTO atualizar(Long id, SolicitacaoServicoRequestDTO dto) {
        SolicitacaoServico existente = solicitacaoServicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação de Serviço não encontrada para atualização com ID: " + id));

        modelMapper.map(dto, existente);

        if (dto.getClienteId() != null && !existente.getCliente().getId().equals(dto.getClienteId())) {
            Cliente novoCliente = clienteService.buscarEntidadePorId(dto.getClienteId());
            existente.setCliente(novoCliente);
        }

        if (dto.getServicoId() != null && !existente.getServico().getId().equals(dto.getServicoId())) {
            Servico novoServico = servicoRepository.findById(dto.getServicoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado com ID: " + dto.getServicoId()));
            existente.setServico(novoServico);
        }
        
        if (dto.getStatusSolicitacao() != null) {
            existente.setStatusSolicitacao(dto.getStatusSolicitacao());
        }

        SolicitacaoServico atualizado = solicitacaoServicoRepository.save(existente);
        return modelMapper.map(atualizado, SolicitacaoServicoResponseDTO.class);
    }

    @Transactional
    public void deletar(Long id) {
        if (!solicitacaoServicoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Solicitação de Serviço não encontrada para exclusão com ID: " + id);
        }
        solicitacaoServicoRepository.deleteById(id);
    }

    public SolicitacaoServico buscarEntidadePorId(Long id) {
        return solicitacaoServicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação de Serviço não encontrada com ID: " + id));
    }
}