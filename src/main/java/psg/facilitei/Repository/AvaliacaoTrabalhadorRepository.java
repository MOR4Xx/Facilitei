package psg.facilitei.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import psg.facilitei.Entity.AvaliacaoTrabalhador;

@Repository
public interface AvaliacaoTrabalhadorRepository extends JpaRepository<AvaliacaoTrabalhador, Long> {
}
