export interface PoolingRepositoryPort {
  createPool(year: number, members: { shipId: string; cb_before: number; cb_after: number }[]): Promise<void>;
}
