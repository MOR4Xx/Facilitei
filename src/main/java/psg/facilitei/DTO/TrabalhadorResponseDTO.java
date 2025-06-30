package psg.facilitei.DTO;

import java.util.List;

public class TrabalhadorResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private EnderecoResponseDTO endereco;
    private List<ServicoResponseDTO> servicos;
    private List<AvaliacaoTrabalhadorRequestDTO> avaliacoesTrabalhador;
    private Integer notaTrabalhador;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
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
        return endereco;
    }
    public void setEndereco(EnderecoResponseDTO endereco) {
        this.endereco = endereco;
    }
    public List<ServicoResponseDTO> getServicos() {
        return servicos;
    }
    public void setServicos(List<ServicoResponseDTO> servicos) {
        this.servicos = servicos;
    }
    public List<AvaliacaoTrabalhadorRequestDTO> getAvaliacoesTrabalhador() {
        return avaliacoesTrabalhador;
    }
    public void setAvaliacoesTrabalhador(List<AvaliacaoTrabalhadorRequestDTO> avaliacoesTrabalhador) {
        this.avaliacoesTrabalhador = avaliacoesTrabalhador;
    }
    public Integer getNotaTrabalhador() {
        return notaTrabalhador;
    }
    public void setNotaTrabalhador(Integer notaTrabalhador) {
        this.notaTrabalhador = notaTrabalhador;
    }

}
