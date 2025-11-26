package psg.facilitei.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import psg.facilitei.Entity.AvaliacaoServico;

import java.util.List;

@Repository
public interface AvaliacaoServicoRepository extends JpaRepository<AvaliacaoServico, Long> {

    List<AvaliacaoServico> findByServicoId(Long servicoId);

    List<AvaliacaoServico> findByClienteId(Long clienteId);

    @Query("SELECT a FROM AvaliacaoServico a WHERE a.servico.trabalhador.id = :trabalhadorId")
    List<AvaliacaoServico> findByTrabalhadorId(@Param("trabalhadorId") Long trabalhadorId);

    @Query("SELECT AVG(a.nota) FROM AvaliacaoServico a WHERE a.servico.trabalhador.id = :trabalhadorId")
    Double calcularMediaPorTrabalhador(@Param("trabalhadorId") Long trabalhadorId);
}
