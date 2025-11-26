package psg.facilitei.Services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadArquivo(MultipartFile file) {
        try {
            // Envia o arquivo para a nuvem e pega o resultado
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());

            // Extrai a URL segura (https) da resposta
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Erro ao fazer upload da imagem", e);
        }
    }
}