package psg.facilitei.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import psg.facilitei.Entity.AvaliacaoServico;

@Repository
public interface AvaliacaoServicoRepository extends JpaRepository<AvaliacaoServico, Long> {
}
