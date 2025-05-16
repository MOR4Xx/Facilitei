package psg.facilitei.Entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String email;
    private String senha;
    private String fotoPerfil;

    private Endereco endereco;

    private List<Servico> servicos = new ArrayList<>();

    private List<Avaliacao> avaliacaoTrabalho = new ArrayList<>();

    private List<Avaliacao> avaliacaoCliente = new ArrayList<>();

    public Cliente() {
    }

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
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Cliente other = (Cliente) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (email == null) {
            if (other.email != null)
                return false;
        } else if (!email.equals(other.email))
            return false;
        return true;
    }

    
    
}