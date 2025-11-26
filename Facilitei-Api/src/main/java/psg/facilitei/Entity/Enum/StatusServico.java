package psg.facilitei.Entity.Enum;

public enum StatusServico {
    SOLICITADO,        // Cliente solicitou o serviço
    AGUARDANDO_CONTATO, // Aguardando retorno do prestador
    EM_ANALISE,         // Avaliando a viabilidade
    APROVADO,           // Serviço aprovado e agendado
    EM_ANDAMENTO,       // Serviço está sendo realizado
    PAUSADO,            // Serviço temporariamente interrompido
    FINALIZADO,         // Serviço concluído
    CANCELADO,          // Serviço cancelado pelo cliente ou prestador
    NAO_COMPARECEU,     // Prestador ou cliente não compareceu
    PENDENTE,
    PENDENTE_APROVACAO, // Trabalhador finalizou, aguardando cliente aprovar
    RECUSADO
}
