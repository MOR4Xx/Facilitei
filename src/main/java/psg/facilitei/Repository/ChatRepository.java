package psg.facilitei.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import psg.facilitei.Entity.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long>{

}
