package psg.facilitei.Entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import psg.facilitei.Entity.Enum.TipoServico;

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

    @ElementCollection(targetClass = TipoServico.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "trabalhador_habilidades", joinColumns = @JoinColumn(name = "trabalhador_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "habilidade")
    private List<TipoServico> habilidades = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "servico_principal")
    private TipoServico servicoPrincipal;

    @OneToMany(mappedBy = "trabalhador", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<AvaliacaoTrabalhador> avaliacoesTrabalhador = new ArrayList<>();

    @Column(name = "nota_trabalhador")
    private Double notaTrabalhador = 0.0;

    @Column(name = "disponibilidade")
    private String disponibilidade;

    @Column(name = "sobre", length = 200)
    private String sobre;

}