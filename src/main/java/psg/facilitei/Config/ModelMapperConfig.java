package psg.facilitei.Config;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import psg.facilitei.DTO.ServicoRequestDTO;
import psg.facilitei.DTO.ServicoResponseDTO;
import psg.facilitei.DTO.SolicitacaoServicoResponseDTO;
import psg.facilitei.Entity.Servico;
import psg.facilitei.Entity.SolicitacaoServico;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);



        Converter<Servico, Long> servicoToTrabalhadorIdConverter = context ->
                context.getSource() == null || context.getSource().getTrabalhador() == null
                        ? null : context.getSource().getTrabalhador().getId();

        Converter<Servico, Long> servicoToClienteIdConverter = context ->
                context.getSource() == null || context.getSource().getCliente() == null
                        ? null : context.getSource().getCliente().getId();

        Converter<Servico, Long> servicoToDisponibilidadeIdConverter = context ->
                context.getSource() == null || context.getSource().getDisponibilidade() == null
                        ? null : context.getSource().getDisponibilidade().getId();

        Converter<SolicitacaoServico, Long> solicitacaoToClienteIdConverter = context ->
                context.getSource() == null || context.getSource().getCliente() == null
                        ? null : context.getSource().getCliente().getId();

        Converter<SolicitacaoServico, Long> solicitacaoToServicoIdConverter = context ->
                context.getSource() == null || context.getSource().getServico() == null
                        ? null : context.getSource().getServico().getId();

        Converter<SolicitacaoServico, String> solicitacaoToStatusConverter = context ->
                context.getSource() == null || context.getSource().getStatusSolicitacao() == null
                        ? null : context.getSource().getStatusSolicitacao().name();
        

        Converter<Disponibilidade, Long> disponibilidadeToTrabalhadorIdConverter = context ->
                context.getSource() == null || context.getSource().getTrabalhador() == null
                        ? null : context.getSource().getTrabalhador().getId();




        modelMapper.createTypeMap(ServicoRequestDTO.class, Servico.class)
                .addMappings(mapper -> {
                    mapper.skip(Servico::setId);
                    mapper.skip(Servico::setTrabalhador);
                    mapper.skip(Servico::setCliente);
                });

        modelMapper.createTypeMap(Servico.class, ServicoResponseDTO.class)
                .addMappings(mapper -> {
                    mapper.using(servicoToTrabalhadorIdConverter).map(source -> source, ServicoResponseDTO::setTrabalhadorId);
                    mapper.using(servicoToClienteIdConverter).map(source -> source, ServicoResponseDTO::setClienteId);
                    mapper.using(servicoToDisponibilidadeIdConverter).map(source -> source, ServicoResponseDTO::setDisponibilidadeId);
                });

        modelMapper.createTypeMap(SolicitacaoServico.class, SolicitacaoServicoResponseDTO.class)
                .addMappings(mapper -> {
                    mapper.using(solicitacaoToClienteIdConverter).map(source -> source, SolicitacaoServicoResponseDTO::setClienteId);
                    mapper.using(solicitacaoToServicoIdConverter).map(source -> source, SolicitacaoServicoResponseDTO::setServicoId);
                    mapper.using(solicitacaoToStatusConverter).map(source -> source, SolicitacaoServicoResponseDTO::setStatus);
                });


        modelMapper.createTypeMap(Disponibilidade.class, DisponibilidadeResponseDTO.class)
                .addMappings(mapper -> {
                    mapper.using(disponibilidadeToTrabalhadorIdConverter).map(source -> source, DisponibilidadeResponseDTO::setTrabalhadorId);
                });


        return modelMapper;
    }
}