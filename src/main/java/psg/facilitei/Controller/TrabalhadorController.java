package psg.facilitei.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import psg.facilitei.Services.TrabalhadorService;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/trabalhadores")
public class TrabalhadorController {

    @Autowired
    private TrabalhadorService service;

    @PostMapping("path")
    public String CreateTrabalhador(@RequestBody String entity) {
        
        return entity;
    }
    

    }


