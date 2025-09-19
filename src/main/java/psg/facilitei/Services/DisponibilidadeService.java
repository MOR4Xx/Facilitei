package psg.facilitei.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import psg.facilitei.Repository.DisponibilidadeRepository;


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
    private TrabalhadorService trabalhadorService;

    @Autowired
    private ModelMapper modelMapper;


    @Transactional
    public DisponibilidadeResponseDTO create(DisponibilidadeRequestDTO dto) {

        if (dto.getDataHoraInicio().isAfter(dto.getDataHoraFim())) {
            throw new BusinessRuleException("Data de início deve ser antes da data de fim.");
        }

        Disponibilidade disponibilidade = modelMapper.map(dto, Disponibilidade.class);


        Trabalhador trabalhador = trabalhadorService.buscarEntidadePorId(dto.getTrabalhadorId());
        disponibilidade.setTrabalhador(trabalhador);

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


    public Disponibilidade buscarEntidadePorId(Long id) {
        return disponibilidadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disponibilidade não encontrada com ID: " + id));
    }


    @Transactional
    public DisponibilidadeResponseDTO update(Long id, DisponibilidadeRequestDTO dto) {

        Disponibilidade disponibilidade = disponibilidadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disponibilidade não encontrada com ID: " + id));

        if (dto.getDataHoraInicio().isAfter(dto.getDataHoraFim())) {
            throw new BusinessRuleException("Data de início deve ser antes da data de fim.");
        }


        modelMapper.map(dto, disponibilidade);


        if (dto.getTrabalhadorId() != null && !disponibilidade.getTrabalhador().getId().equals(dto.getTrabalhadorId())) {
            Trabalhador novoTrabalhador = trabalhadorService.buscarEntidadePorId(dto.getTrabalhadorId());
            disponibilidade.setTrabalhador(novoTrabalhador);
        }

        Disponibilidade updated = disponibilidadeRepository.save(disponibilidade);
        return modelMapper.map(updated, DisponibilidadeResponseDTO.class);
    }

    @Transactional
    public void delete(Long id) {
        Disponibilidade disponibilidade = disponibilidadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disponibilidade não encontrada para exclusão com ID: " + id));
        disponibilidadeRepository.delete(disponibilidade);
    }
}