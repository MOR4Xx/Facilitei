package psg.facilitei.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import psg.facilitei.Entities.Servico;

@Repository
public interface ServicoRepository extends JpaRepository <Servico, Long>{

}
