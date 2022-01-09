/**
 * Éssa é uma model que representa o dominio dessa feature,
 * como basicamente vai ser um tipo, podemos definir como uma interface.
 */

export interface Project {
  uid: string;
  name: string;
  description: string;
  endDate?: Date;
  startDate?: Date;
}
