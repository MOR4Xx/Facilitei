package psg.facilitei.Entities;

import java.util.List;

public class Avaliacao {
    private Long id;
    private Cliente avaliador;
    private Cliente avaliado;
    private int nota;
    private String comentario;
    private List<String> fotos;
}
