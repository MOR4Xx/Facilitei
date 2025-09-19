package psg.facilitei.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "cliente")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true) 
@ToString(callSuper = true) 
@PrimaryKeyJoinColumn(name = "cliente_id") 
public class Cliente extends Usuario{


    @Column(name = "nota_cliente", nullable = false)
    private Integer notaCliente = 0;
}