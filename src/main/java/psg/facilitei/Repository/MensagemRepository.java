package psg.facilitei.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import psg.facilitei.Entity.Mensagem;

import java.util.List;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {
    // Busca o histórico ordenado por data
    List<Mensagem> findByServicoIdOrderByDataEnvioAsc(Long servicoId);
}