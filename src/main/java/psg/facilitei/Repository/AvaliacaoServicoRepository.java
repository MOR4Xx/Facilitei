package psg.facilitei.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import psg.facilitei.Entity.AvaliacaoServico;

import java.util.List;

@Repository
public interface AvaliacaoServicoRepository extends JpaRepository<AvaliacaoServico, Long> {

    List<AvaliacaoServico> findByServicoId(Long servicoId);

    List<AvaliacaoServico> findByClienteId(Long clienteId);
}
