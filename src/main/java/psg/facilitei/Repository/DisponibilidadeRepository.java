package psg.facilitei.Repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import psg.facilitei.Entity.Disponibilidade;

@Repository
public interface DisponibilidadeRepository extends JpaRepository<Disponibilidade, Long> {

    boolean existsByTrabalhadorIdAndDataHoraInicioLessThanEqualAndDataHoraFimGreaterThanEqual(
            Long trabalhadorId,
            LocalDateTime dataHoraFim,
            LocalDateTime dataHoraInicio);

    boolean existsByTrabalhadorIdAndDataHoraInicioLessThanEqualAndDataHoraFimGreaterThanEqualAndIdNot(
            Long trabalhadorId,
            LocalDateTime dataHoraFim,
            LocalDateTime dataHoraInicio,
            Long id);

}
