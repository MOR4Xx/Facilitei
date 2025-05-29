package psg.facilitei.Entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "avaliacao")
public class Avaliacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "avaliador", nullable = false)
    private Cliente avaliador;
    @JoinColumn(name = "avaliado", nullable = false)
    private Cliente avaliado;
    @JoinColumn(name = "nota", nullable = false)
    private int nota;
    @JoinColumn(name = "comentario", nullable = false)
    private String comentario;
    @OneToMany(mappedBy = "fotos_cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<String> fotos;

    public Avaliacao() {
    }

    

    public Avaliacao(Long id, Cliente avaliador, Cliente avaliado, int nota, String comentario, List<String> fotos) {
        this.id = id;
        this.avaliador = avaliador;
        this.avaliado = avaliado;
        this.nota = nota;
        this.comentario = comentario;
        this.fotos = fotos;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cliente getAvaliador() {
        return avaliador;
    }

    public void setAvaliador(Cliente avaliador) {
        this.avaliador = avaliador;
    }

    public Cliente getAvaliado() {
        return avaliado;
    }

    public void setAvaliado(Cliente avaliado) {
        this.avaliado = avaliado;
    }

    public int getNota() {
        return nota;
    }

    public void setNota(int nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public List<String> getFotos() {
        return fotos;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((avaliador == null) ? 0 : avaliador.hashCode());
        result = prime * result + ((avaliado == null) ? 0 : avaliado.hashCode());
        result = prime * result + nota;
        result = prime * result + ((comentario == null) ? 0 : comentario.hashCode());
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
        Avaliacao other = (Avaliacao) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (avaliador == null) {
            if (other.avaliador != null)
                return false;
        } else if (!avaliador.equals(other.avaliador))
            return false;
        if (avaliado == null) {
            if (other.avaliado != null)
                return false;
        } else if (!avaliado.equals(other.avaliado))
            return false;
        if (nota != other.nota)
            return false;
        if (comentario == null) {
            if (other.comentario != null)
                return false;
        } else if (!comentario.equals(other.comentario))
            return false;
        return true;
    }

}
