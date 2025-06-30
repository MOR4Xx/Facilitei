package psg.facilitei.DTO;

import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class TrabalhadorRequestDTO {

    @NotBlank
    private String nome;
    @NotBlank
    @Email
    private String email;
    private EnderecoResponseDTO EnderecoResponseDTO;
    private List<Long> servicosIds;
    private List<Long> avaliacoesIds;
    public String getSenha() {
        return senha;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }
    private Integer notaTrabalhador;
    private String senha;
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
   
    public EnderecoResponseDTO getEndereco() {
        return EnderecoResponseDTO;
    }
    public void setEndereco(EnderecoResponseDTO endereco) {
        this.EnderecoResponseDTO = endereco;
    }
    public List<Long> getServicosIds() {
        return servicosIds;
    }
    public void setServicosIds(List<Long> servicosIds) {
        this.servicosIds = servicosIds;
    }
    public List<Long> getAvaliacoesIds() {
        return avaliacoesIds;
    }
    public void setAvaliacoesIds(List<Long> avaliacoesIds) {
        this.avaliacoesIds = avaliacoesIds;
    }
    public Integer getNotaTrabalhador() {
        return notaTrabalhador;
    }
    public void setNotaTrabalhador(Integer notaTrabalhador) {
        this.notaTrabalhador = notaTrabalhador;
    }

}
