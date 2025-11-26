package psg.facilitei.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor; 
import lombok.Data;
import lombok.NoArgsConstructor; 
import lombok.EqualsAndHashCode; 
import lombok.ToString; 

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Data 
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "telefone")
    private String telefone;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "senha", nullable = false)
    private String senha;

    @Column(name = "url_foto")
    private String urlFoto;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_id", referencedColumnName = "id")
    @EqualsAndHashCode.Exclude 
    @ToString.Exclude 
    private Endereco endereco;


}