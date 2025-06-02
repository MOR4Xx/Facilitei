package psg.facilitei.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import psg.facilitei.Controller.TrabalhadorController;

@Service
public class TrabalhadorService {

    @Autowired
    private TrabalhadorController repository;
}
