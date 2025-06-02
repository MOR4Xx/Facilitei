package psg.facilitei.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensagem")
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "O remetente é obrigatório")
    @ManyToOne
    @JoinColumn(name = "remetente_id", nullable = false)
    private Cliente remetente;

    @NotNull(message = "O destinatário é obrigatório")
    @ManyToOne
    @JoinColumn(name = "destinatario_id", nullable = false)
    private Cliente destinatario;

    @NotBlank(message = "O conteúdo da mensagem não pode estar em branco")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @NotNull
    @Column(name = "data_envio", nullable = false)
    private LocalDateTime dataEnvio = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    public Mensagem() {}

    // Getters e setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cliente getRemetente() {
        return remetente;
    }

    public void setRemetente(Cliente remetente) {
        this.remetente = remetente;
    }

    public Cliente getDestinatario() {
        return destinatario;
    }

    public void setDestinatario(Cliente destinatario) {
        this.destinatario = destinatario;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public LocalDateTime getDataEnvio() {
        return dataEnvio;
    }

    public void setDataEnvio(LocalDateTime dataEnvio) {
        this.dataEnvio = dataEnvio;
    }

    public Chat getChat() {
        return chat;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((remetente == null) ? 0 : remetente.hashCode());
        result = prime * result + ((destinatario == null) ? 0 : destinatario.hashCode());
        result = prime * result + ((conteudo == null) ? 0 : conteudo.hashCode());
        result = prime * result + ((dataEnvio == null) ? 0 : dataEnvio.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Mensagem other = (Mensagem) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (remetente == null) {
            if (other.remetente != null)
                return false;
        } else if (!remetente.equals(other.remetente))
            return false;
        if (destinatario == null) {
            if (other.destinatario != null)
                return false;
        } else if (!destinatario.equals(other.destinatario))
            return false;
        if (conteudo == null) {
            if (other.conteudo != null)
                return false;
        } else if (!conteudo.equals(other.conteudo))
            return false;
        if (dataEnvio == null) {
            if (other.dataEnvio != null)
                return false;
        } else if (!dataEnvio.equals(other.dataEnvio))
            return false;
        return true;
    }
    
}
