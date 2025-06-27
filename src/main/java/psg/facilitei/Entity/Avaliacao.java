package psg.facilitei.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Entity
@Table(name = "avaliacoes")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1)
    @Max(5)
    @Column(name = "nota", nullable = false)
    private int nota;

    @NotBlank
    @Column(name = "comentario", nullable = false, length = 1000)
    private String comentario;

    @ElementCollection
    @CollectionTable(
            name = "avaliacao_fotos",
            joinColumns = @JoinColumn(name = "avaliacao_id")
    )
    @Column(name = "url_foto", length = 500)
    private List<@NotBlank String> fotos;



    public Long getId() {
        return id;
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

    public void setFotos(List<String> fotos) {
        this.fotos = fotos;
    }
}
