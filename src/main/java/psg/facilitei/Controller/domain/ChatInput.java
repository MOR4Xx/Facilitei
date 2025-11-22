package psg.facilitei.Controller.domain;

public record ChatInput(
    Long servicoId, 
    String user, 
    String message, 
    String type, // "TEXTO" ou "IMAGEM"
    String fileUrl // URL da foto (opcional)
) {}