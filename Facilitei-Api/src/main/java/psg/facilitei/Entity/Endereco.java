package psg.facilitei.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "endereco")
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String rua;

    @Column(nullable = false)
    private String numero;

    @Column(nullable = false)
    private String bairro;

    @Column(nullable = false)
    private String cidade;

    @Column(nullable = false, length = 20)
    private String estado;

    @Column(nullable = false)
    private String cep;
}