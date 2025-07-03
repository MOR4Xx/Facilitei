package psg.facilitei.Entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull; // Changed from NotBlank to NotNull
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "disponibilidade")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Disponibilidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_hora_inicio", nullable = false) 
    @NotNull(message = "A data e hora de início são obrigatórias.") 
    private LocalDateTime dataHoraInicio;

    @Column(name = "data_hora_fim", nullable = false) 
    @NotNull(message = "A data e hora de fim são obrigatórias.") 
    private LocalDateTime dataHoraFim;

    @ManyToOne
    @JoinColumn(name = "trabalhador_id", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Trabalhador trabalhador;

    @OneToMany(mappedBy = "disponibilidade", cascade = CascadeType.ALL, orphanRemoval = true) 
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Servico> servicos = new ArrayList<>();

}