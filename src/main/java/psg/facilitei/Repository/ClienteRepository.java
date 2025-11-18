package psg.facilitei.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import psg.facilitei.Entity.Cliente;

public interface ClienteRepository extends JpaRepository <Cliente, Long>{

    Cliente findByNome(String nome);

    Optional<Cliente> findByEmail(String email);
}

