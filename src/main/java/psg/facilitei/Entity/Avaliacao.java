package psg.facilitei.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor; // Added
import lombok.Data; // Added
import lombok.NoArgsConstructor; // Added

import java.util.List;

@Entity
@Table(name = "avaliacoes")
@Inheritance(strategy = InheritanceType.JOINED)
@Data // Generates getters, setters, toString, equals, and hashCode
@NoArgsConstructor // Generates a no-argument constructor
@AllArgsConstructor // Generates a constructor with all fields
public abstract class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1)
    @Max(5)
    @Column(name = "nota", nullable = false)
    private int nota;

    @Column(name = "comentario", length = 1000) // nullable = true is default, can be omitted
    private String comentario;

    @ElementCollection
    @CollectionTable(
            name = "avaliacao_fotos",
            joinColumns = @JoinColumn(name = "avaliacao_id")
    )
    @Column(name = "url_foto", length = 500)
    private List<String> fotos; // Removed @NotBlank as it's meant for String fields, not List elements.

}