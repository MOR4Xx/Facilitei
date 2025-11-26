package psg.facilitei.Repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import psg.facilitei.Entity.Servico;
import psg.facilitei.Entity.Enum.TipoServico;

@Repository
public interface ServicoRepository extends JpaRepository <Servico, Long>{

    boolean existsByTipoServicoAndTrabalhadorId(TipoServico tipoServico, Long trabalhadorId);

    List<Servico> findByClienteId(Long clienteId);

    List<Servico> findByTrabalhadorId(Long trabalhadorId);
}
