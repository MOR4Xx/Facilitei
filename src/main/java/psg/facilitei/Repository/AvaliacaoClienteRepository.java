package psg.facilitei.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import psg.facilitei.Entity.AvaliacaoCliente;

import java.util.List;

@Repository
public interface AvaliacaoClienteRepository extends JpaRepository<AvaliacaoCliente, Long> {
    List<AvaliacaoCliente> findByClienteId(Long clienteId);
}
