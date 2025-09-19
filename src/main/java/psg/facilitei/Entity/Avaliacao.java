package psg.facilitei.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor; 
import lombok.Data; 
import lombok.NoArgsConstructor; 

import java.util.List;

@Entity
@Table(name = "avaliacoes")
@Inheritance(strategy = InheritanceType.JOINED)
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public abstract class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1)
    @Max(5)
    @Column(name = "nota", nullable = false)
    private int nota;

    @Column(name = "comentario", length = 1000) 
    private String comentario;

    @ElementCollection
    @CollectionTable(
            name = "avaliacao_fotos",
            joinColumns = @JoinColumn(name = "avaliacao_id")
    )
    @Column(name = "url_foto", length = 500)
    private List<String> fotos; 

}