package psg.facilitei.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class EnderecoRequestDTO {

    @NotBlank(message = "Rua é obrigatória.")
    private String rua;

    @NotBlank(message = "Número é obrigatório.")
    private String numero;

    @NotBlank(message = "Bairro é obrigatório.")
    private String bairro;

    @NotBlank(message = "Cidade é obrigatória.")
    private String cidade;

    @NotBlank(message = "Estado é obrigatório.")
    private String estado;

    @NotBlank(message = "CEP é obrigatório.")
    @Pattern(regexp = "\\d{5}-\\d{3}|\\d{8}", message = "CEP inválido. Use o formato 12345-678 ou 12345678")
    private String cep;

    public EnderecoRequestDTO() {}

    public EnderecoRequestDTO(String rua, String numero, String bairro, String cidade, String estado, String cep) {
        this.rua = rua;
        this.numero = numero;
        this.bairro = bairro;
        this.cidade = cidade;
        this.estado = estado;
        this.cep = cep;
    }
}
