import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type EnchantItem = {
  level: number;
  failed: number;
  [key: number]: number;
};

type Props = {
  enchantItem: EnchantItem;
};

export function AnalysisOfEnchantment({ enchantItem }: Props) {
  const data = Object.keys(enchantItem)
    .filter((key) => !isNaN(Number(key)))
    .map((key) => ({
      level: key,
      tentativas: enchantItem[Number(key)],
    }));

  const XAxisMemorized = useMemo(
    () => (
      <XAxis
        dataKey="level"
        label={{
          value: "Nível de Encantamento",
          position: "insideBottom",
          dy: 10,
        }}
      />
    ),
    []
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        {XAxisMemorized}
        <YAxis
          label={{
            value: "Tentativas",
            angle: -90,
            dx: -10,
          }}
        />
        <Tooltip />
        <Bar dataKey="tentativas" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
