package psg.facilitei.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import psg.facilitei.Entity.Mensagem;

public interface MensagemRepository extends JpaRepository<Mensagem, Long>{

}
