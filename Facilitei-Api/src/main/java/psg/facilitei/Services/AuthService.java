package psg.facilitei.Services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import psg.facilitei.DTO.ClienteResponseDTO;
import psg.facilitei.DTO.LoginResponseDTO;
import psg.facilitei.DTO.TrabalhadorResponseDTO;
import psg.facilitei.Entity.Cliente;
import psg.facilitei.Entity.Trabalhador;
import psg.facilitei.Exceptions.ResourceNotFoundException; // ou crie uma AuthenticationException
import psg.facilitei.Repository.ClienteRepository;
import psg.facilitei.Repository.TrabalhadorRepository;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private TrabalhadorRepository trabalhadorRepository;

    @Autowired
    private ModelMapper modelMapper;

    public LoginResponseDTO login(String email, String senha) {
        Optional<Cliente> clienteOpt = clienteRepository.findByEmail(email);
        if (clienteOpt.isPresent()) {
            Cliente cliente = clienteOpt.get();
            if (cliente.getSenha().equals(senha)) { // Simples comparação de string (como no frontend)
                ClienteResponseDTO dto = modelMapper.map(cliente, ClienteResponseDTO.class);
                return new LoginResponseDTO("cliente", dto);
            }
        }

        Optional<Trabalhador> trabalhadorOpt = trabalhadorRepository.findByEmail(email);
        if (trabalhadorOpt.isPresent()) {
            Trabalhador trabalhador = trabalhadorOpt.get();
            if (trabalhador.getSenha().equals(senha)) { // Simples comparação de string
                TrabalhadorResponseDTO dto = modelMapper.map(trabalhador, TrabalhadorResponseDTO.class);
                return new LoginResponseDTO("trabalhador", dto);
            }
        }

        // Se ninguém foi encontrado ou a senha estava errada
        throw new ResourceNotFoundException("Email ou senha inválidos.");
    }

    public boolean emailExists(String email) {
        return clienteRepository.findByEmail(email).isPresent() ||
               trabalhadorRepository.findByEmail(email).isPresent();
    }
}