package psg.facilitei.Entity;

import java.util.List;

import jakarta.persistence.*;

@MappedSuperclass
public class Avaliacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nota", nullable = false)
    private int nota;

    @Column(name = "comentario", nullable = false)
    private String comentario;

}
