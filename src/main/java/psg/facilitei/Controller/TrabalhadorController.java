package psg.facilitei.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import psg.facilitei.Services.TrabalhadorService;

@RestController
@RequestMapping("/trabalhadores")
public class TrabalhadorController {

    @Autowired
    private TrabalhadorService service;

    @PostMapping(value = "/create")
    public void create(){

    }

}
