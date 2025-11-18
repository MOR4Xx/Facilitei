package psg.facilitei.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String role;
    private Object user; // Pode ser ClienteResponseDTO ou TrabalhadorResponseDTO
}