package psg.facilitei.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import psg.facilitei.Entity.AvaliacaoCliente;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface AvaliacaoClienteRepository extends JpaRepository<AvaliacaoCliente, Long> {
    List<AvaliacaoCliente> findByClienteId(Long clienteId);

    @Modifying
    @Transactional
    @Query("DELETE FROM AvaliacaoCliente a WHERE a.trabalhador.id = :id")
    void deleteByTrabalhadorId(@Param("id") Long id);
}
