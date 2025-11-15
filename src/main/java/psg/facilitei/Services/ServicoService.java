package psg.facilitei.Services;

import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import psg.facilitei.DTO.ServicoRequestDTO;
import psg.facilitei.DTO.ServicoResponseDTO;
import psg.facilitei.Entity.Cliente;
import psg.facilitei.Entity.Servico;
import psg.facilitei.Entity.Trabalhador;
import psg.facilitei.Entity.Enum.StatusServico;
import psg.facilitei.Exceptions.ResourceNotFoundException;
import psg.facilitei.Repository.ClienteRepository;
import psg.facilitei.Repository.ServicoRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServicoService {

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private TrabalhadorService trabalhadorService;

    @Autowired
    private ClienteRepository clienteRepository;

    public List<ServicoResponseDTO> listarTodos() {
        return servicoRepository.findAll()
                .stream()
                .map(servico -> modelMapper.map(servico, ServicoResponseDTO.class))
                .collect(Collectors.toList());
    }

    public ServicoResponseDTO buscarPorId(Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado com ID: " + id));
        return modelMapper.map(servico, ServicoResponseDTO.class);
    }

    public Servico buscarEntidadePorId(Long id) {
        return servicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado com ID: " + id));
    }

    @Transactional
    public ServicoResponseDTO criar(ServicoRequestDTO dto) {
        Servico servico = modelMapper.map(dto, Servico.class);

        Trabalhador trabalhador = trabalhadorService.buscarEntidadePorId(dto.getTrabalhadorId());
        servico.setTrabalhador(trabalhador);

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
            .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + dto.getClienteId()));
        servico.setCliente(cliente);


        if (servico.getStatusServico() == null) {
            servico.setStatusServico(StatusServico.PENDENTE);
        }

        Servico salvo = servicoRepository.save(servico);
        return modelMapper.map(salvo, ServicoResponseDTO.class);
    }

    @Transactional
    public ServicoResponseDTO atualizar(Long id, ServicoRequestDTO dto) {
        Servico existente = servicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado para atualização."));

        modelMapper.map(dto, existente);
        existente.setTitulo(dto.getTitulo());

        if (dto.getTrabalhadorId() != null && !existente.getTrabalhador().getId().equals(dto.getTrabalhadorId())) {
            Trabalhador novoTrabalhador = trabalhadorService.buscarEntidadePorId(dto.getTrabalhadorId());
            existente.setTrabalhador(novoTrabalhador);
        }

        if (dto.getClienteId() != null && !existente.getCliente().getId().equals(dto.getClienteId())) {
            Cliente novoCliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + dto.getClienteId()));
            existente.setCliente(novoCliente);
        }

        Servico atualizado = servicoRepository.save(existente);
        return modelMapper.map(atualizado, ServicoResponseDTO.class);
    }

    @Transactional
    public void deletar(Long id) {
        if (!servicoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Serviço não encontrado para exclusão.");
        }
        servicoRepository.deleteById(id);
    }
}