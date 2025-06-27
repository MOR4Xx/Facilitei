package psg.facilitei.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import psg.facilitei.Repository.DisponibilidadeRepository;
import psg.facilitei.Repository.TrabalhadorRepository;
import psg.facilitei.DTO.DisponibilidadeRequestDTO;
import psg.facilitei.DTO.DisponibilidadeResponseDTO;
import psg.facilitei.Entity.Disponibilidade;
import psg.facilitei.Entity.Trabalhador;
import psg.facilitei.Exceptions.ResourceNotFoundException;
import psg.facilitei.Exceptions.BusinessRuleException;

import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DisponibilidadeService {

    @Autowired
    private DisponibilidadeRepository disponibilidadeRepository;

    @Autowired
    private TrabalhadorRepository trabalhadorRepository;

    @Autowired
    private ModelMapper modelMapper;


    @Transactional
    public DisponibilidadeResponseDTO create(DisponibilidadeRequestDTO dto) {

        if (dto.getDataHoraInicio().isAfter(dto.getDataHoraFim())) {
            throw new BusinessRuleException("Data de início deve ser antes da data de fim.");
        }

        Disponibilidade disponibilidade = modelMapper.map(dto, Disponibilidade.class);
        Disponibilidade saved = disponibilidadeRepository.save(disponibilidade);
        return modelMapper.map(saved, DisponibilidadeResponseDTO.class);
    }


    @Transactional(readOnly = true)
    public List<DisponibilidadeResponseDTO> getAll() {
        return disponibilidadeRepository.findAll()
                .stream()
                .map(d -> modelMapper.map(d, DisponibilidadeResponseDTO.class))
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public DisponibilidadeResponseDTO getById(Long id) {
        Disponibilidade disponibilidade = disponibilidadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disponibilidade não encontrada com ID: " + id));
        return modelMapper.map(disponibilidade, DisponibilidadeResponseDTO.class);
    }


    @Transactional
    public DisponibilidadeResponseDTO update(Long id, DisponibilidadeRequestDTO dto) {

        Disponibilidade disponibilidade = disponibilidadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disponibilidade não encontrada com ID: " + id));

        if (dto.getDataHoraInicio().isAfter(dto.getDataHoraFim())) {
            throw new BusinessRuleException("Data de início deve ser antes da data de fim.");
        }

        disponibilidade.setHorarioInicio(dto.getDataHoraInicio());
        disponibilidade.setHorarioFim(dto.getDataHoraFim());
        Trabalhador trabalhador = trabalhadorRepository.findById(dto.getTrabalhadorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Trabalhador não encontrado com ID: " + dto.getTrabalhadorId()));
        disponibilidade.setTrabalhador(trabalhador);
        Disponibilidade updated = disponibilidadeRepository.save(disponibilidade);
        return modelMapper.map(updated, DisponibilidadeResponseDTO.class);
    }

    @Transactional
    public void delete(Long id) {
        Disponibilidade disponibilidade = disponibilidadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disponibilidade não encontrada com ID: " + id));
        disponibilidadeRepository.delete(disponibilidade);
    }
}
