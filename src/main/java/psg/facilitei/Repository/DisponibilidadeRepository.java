package psg.facilitei.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import psg.facilitei.Entity.Disponibilidade;

@Repository
public interface DisponibilidadeRepository extends JpaRepository<Disponibilidade, Long> {

}
