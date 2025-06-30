package psg.facilitei.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import psg.facilitei.Entity.AvaliacaoTrabalhador;

import java.util.List;

@Repository
public interface AvaliacaoTrabalhadorRepository extends JpaRepository<AvaliacaoTrabalhador, Long> {

    List<AvaliacaoTrabalhador> findByTrabalhadorId(Long trabalhadorId);

    List<AvaliacaoTrabalhador> findByClienteId(Long clienteId);
}
