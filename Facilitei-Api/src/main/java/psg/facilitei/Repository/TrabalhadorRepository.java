package psg.facilitei.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import psg.facilitei.Entity.Trabalhador;

public interface TrabalhadorRepository extends JpaRepository<Trabalhador, Long>{
    Optional<Trabalhador> findByEmail(String email);
}
