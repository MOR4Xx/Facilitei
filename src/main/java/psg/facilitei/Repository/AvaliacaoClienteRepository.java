package psg.facilitei.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import psg.facilitei.Entity.AvaliacaoCliente;

@Repository
public interface AvaliacaoClienteRepository extends JpaRepository<AvaliacaoCliente, Long> {

    List<AvaliacaoCliente> findByClienteId(Long clienteId);

    List<AvaliacaoCliente> findByTrabalhadorId(Long trabalhadorId);

    void deleteByTrabalhadorId(Long trabalhadorId);

}
