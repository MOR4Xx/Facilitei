package psg.facilitei.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "endereco")
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Rua é obrigatória")
    @Column(nullable = false)
    private String rua;

    @NotBlank(message = "Número é obrigatório")
    @Column(nullable = false)
    private String numero;

    @NotBlank(message = "Bairro é obrigatório")
    @Column(nullable = false)
    private String bairro;

    @NotBlank(message = "Cidade é obrigatória")
    @Column(nullable = false)
    private String cidade;

    @NotBlank(message = "Estado é obrigatório")
    @Column(nullable = false, length = 2)
    @Size(min = 2, max = 2, message = "O estado deve ter 2 letras (ex: GO, SP)")
    private String estado;

    @NotBlank(message = "CEP é obrigatório")
    @Pattern(regexp = "\\d{5}-\\d{3}", message = "CEP deve estar no formato 00000-000")
    @Column(nullable = false)
    private String cep;

    @OneToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    public Endereco() {}

   

    public Endereco(Long id, @NotBlank(message = "Rua é obrigatória") String rua,
            @NotBlank(message = "Número é obrigatório") String numero,
            @NotBlank(message = "Bairro é obrigatório") String bairro,
            @NotBlank(message = "Cidade é obrigatória") String cidade,
            @NotBlank(message = "Estado é obrigatório") String estado,
            @NotBlank(message = "CEP é obrigatório") @Pattern(regexp = "\\d{5}-\\d{3}", message = "CEP deve estar no formato 00000-000") String cep,
            Cliente cliente) {
        this.id = id;
        this.rua = rua;
        this.numero = numero;
        this.bairro = bairro;
        this.cidade = cidade;
        this.estado = estado;
        this.cep = cep;
        this.cliente = cliente;
    }



    // Getters e setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRua() {
        return rua;
    }

    public void setRua(String rua) {
        this.rua = rua;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

  

    
   
}
