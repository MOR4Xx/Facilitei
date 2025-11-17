package psg.facilitei.Entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "trabalhador")
@Data
@NoArgsConstructor 
@AllArgsConstructor 
@EqualsAndHashCode(callSuper = true) 
@ToString(callSuper = true) 
public class Trabalhador extends Usuario {

    @OneToMany(mappedBy = "trabalhador", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Servico> servicos = new ArrayList<>();

    @OneToMany(mappedBy = "trabalhador", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<AvaliacaoTrabalhador> avaliacoesTrabalhador = new ArrayList<>();

    @Column(name = "nota_trabalhador")
    private Double notaTrabalhador = 0.0;

    @Column(name = "disponibilidade")
    private String disponibilidade;

    @Column(name = "sobre", length = 200, nullable = false)
    private String sobre;

}