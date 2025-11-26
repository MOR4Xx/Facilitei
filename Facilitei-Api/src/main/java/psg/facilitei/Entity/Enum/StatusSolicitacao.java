package psg.facilitei.Entity.Enum;

public enum StatusSolicitacao {
    PENDENTE, // A solicitação foi criada, mas ainda não foi aceita pelo trabalhador
    ACEITA, // O trabalhador aceitou a solicitação
    RECUSADA, // O trabalhador recusou a solicitação
    EM_ANDAMENTO, // O serviço está em execução
    CONCLUIDA, // O serviço foi concluído
    CANCELADA // A solicitação foi cancelada (pelo cliente ou trabalhador)
}
