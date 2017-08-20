export interface IBlackout {
  type: string;
  message: {
    vueltas: number;
    sentido: string;
  }
}
