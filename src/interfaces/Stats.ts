interface Stats {
  totalItems: number;
  avgDuration: number;
  priorities: Record<string, number>;
}

export default Stats;
