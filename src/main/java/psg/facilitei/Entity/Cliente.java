package psg.facilitei.Entity;

import jakarta.persistence.*;


@Entity
@Table(name = "cliente")
public class Cliente extends Usuario{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nota_cliente", nullable = false)
    private Integer notaCliente;

    public Cliente() {}

    public Cliente(Long id, Integer notaCliente ) {
        this.id = id;
        this.notaCliente = notaCliente;
    }

    public Cliente(String nome, String email, String senha, String fotoPerfil, Endereco endereco, Long id, Integer notaCliente) {
        super(nome, email, senha, fotoPerfil, endereco);
        this.id = id;
        this.notaCliente = notaCliente;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNotaCliente() {
        return notaCliente;
    }

    public void setNotaCliente(Integer notaCliente) {
        this.notaCliente = notaCliente;
    }

}
