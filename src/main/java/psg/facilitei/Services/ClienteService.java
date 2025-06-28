package psg.facilitei.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;
import psg.facilitei.DTO.ClienteRequestDTO;
import psg.facilitei.DTO.ClienteResponseDTO;
import psg.facilitei.Entity.Cliente;
import psg.facilitei.Repository.ClienteRepository;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository repository;

    @Autowired
    private ModelMapper modelMapper;

    public ClienteResponseDTO create(ClienteRequestDTO dto) {

        Cliente cliente = repository.save(modelMapper.map(dto, Cliente.class));

        return modelMapper.map(cliente, ClienteResponseDTO.class);
    }

    public ClienteResponseDTO findById(Long id) {
        ClienteResponseDTO clienteDTO = modelMapper.map(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com ID: " + id)), ClienteResponseDTO.class);

        return clienteDTO;
    }

}
