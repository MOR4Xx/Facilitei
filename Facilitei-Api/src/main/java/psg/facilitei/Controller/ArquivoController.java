package psg.facilitei.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import psg.facilitei.Services.CloudinaryService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/arquivos")
public class ArquivoController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> upload(@RequestParam("file") MultipartFile file) {
        // Chama o serviço para salvar
        String url = cloudinaryService.uploadArquivo(file);

        // Retorna um JSON com a URL: { "url": "https://..." }
        Map<String, String> response = new HashMap<>();
        response.put("url", url);

        return ResponseEntity.ok(response);
    }
}