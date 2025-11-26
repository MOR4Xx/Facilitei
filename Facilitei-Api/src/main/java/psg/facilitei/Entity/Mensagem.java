package psg.facilitei.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensagem")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long servicoId; // Vincula a mensagem a um serviço específico

    @Column(nullable = false)
    private String remetente; // Nome ou ID de quem mandou

    @Column(columnDefinition = "TEXT")
    private String conteudo; // O texto da mensagem

    private String tipo; // "TEXTO" ou "IMAGEM"

    private String urlArquivo; // Se for imagem, salva o link aqui

    private LocalDateTime dataEnvio = LocalDateTime.now();
}