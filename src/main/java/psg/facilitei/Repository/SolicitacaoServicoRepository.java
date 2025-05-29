package psg.facilitei.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import psg.facilitei.Entities.SolicitacaoServico;

@Repository
public interface SolicitacaoServicoRepository extends JpaRepository<SolicitacaoServico, Long>{

}
