package psg.facilitei.Entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "cliente")
@Inheritance(strategy = InheritanceType.JOINED)
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    @Column(name = "cliente_nome", nullable = false)
    private String nome;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "O e-mail deve ser válido")
    @Column(name = "cliente_email", nullable = false, unique = true)
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
    @Column(name = "cliente_senha", nullable = false)
    private String senha;

    @Column(name = "cliente_foto_perfil")
    private String fotoPerfil;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_id", referencedColumnName = "id")
    private Endereco endereco;

    @ManyToMany(mappedBy = "clientes")
    private List<Servico> servicos = new ArrayList<>();

    @OneToMany(mappedBy = "avaliadoTrabalho", cascade = CascadeType.ALL)
    private List<Avaliacao> avaliacaoTrabalho = new ArrayList<>();

    @OneToMany(mappedBy = "avaliadoCliente", cascade = CascadeType.ALL)
    private List<Avaliacao> avaliacaoCliente = new ArrayList<>();

    public Cliente() {}

    public Cliente(Long id, String nome, String email, String senha, String fotoPerfil, Endereco endereco,
                   List<Servico> servicos, List<Avaliacao> avaliacaoTrabalho, List<Avaliacao> avaliacaoCliente) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.fotoPerfil = fotoPerfil;
        this.endereco = endereco;
        this.servicos = servicos;
        this.avaliacaoTrabalho = avaliacaoTrabalho;
        this.avaliacaoCliente = avaliacaoCliente;
    }

    // Getters e Setters
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

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public Endereco getEndereco() {
        return endereco;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }

    public List<Servico> getServicos() {
        return servicos;
    }

    public List<Avaliacao> getAvaliacaoTrabalho() {
        return avaliacaoTrabalho;
    }

    public List<Avaliacao> getAvaliacaoCliente() {
        return avaliacaoCliente;
    }

    // equals e hashCode
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((email == null) ? 0 : email.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        Cliente other = (Cliente) obj;
        return id != null && id.equals(other.id) && email != null && email.equals(other.email);
    }
}
