package psg.facilitei.Entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "trabalhador")
public class Trabalhador extends Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "trabalhador", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Servico> servicos = new ArrayList<>();

    @OneToMany(mappedBy = "trabalhador", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<AvaliacaoTrabalhador> avaliacoesTrabalhador = new ArrayList<>();

    @Column(name = "nota_trabalhador")
    private Integer notaTrabalhador;

    public Trabalhador() {
    }

    public Trabalhador(List<Servico> servicos, List<AvaliacaoTrabalhador> avaliacoesTrabalhador, Integer notaTrabalhador) {
        this.servicos = servicos;
        this.avaliacoesTrabalhador = avaliacoesTrabalhador;
        this.notaTrabalhador = notaTrabalhador;
    }

    public Trabalhador(String nome, String email, String senha, String fotoPerfil, Endereco endereco,
            List<Servico> servicos, List<AvaliacaoTrabalhador> avaliacoesTrabalhador, Integer notaTrabalhador) {
        super(nome, email, senha, fotoPerfil, endereco);
        this.servicos = servicos;
        this.avaliacoesTrabalhador = avaliacoesTrabalhador;
        this.notaTrabalhador = notaTrabalhador;
    }

    public List<Servico> getServicos() {
        return servicos;
    }

    public void setServicos(List<Servico> servicos) {
        this.servicos = servicos;
    }

    public List<AvaliacaoTrabalhador> getAvaliacoesTrabalhador() {
        return avaliacoesTrabalhador;
    }

    public void setAvaliacoesTrabalhador(List<AvaliacaoTrabalhador> avaliacoesTrabalhador) {
        this.avaliacoesTrabalhador = avaliacoesTrabalhador;
    }

    public Integer getNotaTrabalhador() {
        return notaTrabalhador;
    }

    public void setNotaTrabalhador(Integer notaTrabalhador) {
        this.notaTrabalhador = notaTrabalhador;
    }
}
