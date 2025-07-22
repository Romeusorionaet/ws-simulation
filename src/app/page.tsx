"use client";

import { AnalysisOfEnchantment } from "@/components/charts/analysis-of-enchantment";
import { Minus } from "lucide-react";
import { useEffect, useState } from "react";

type EnchantItem = {
  level: number;
  failed: number;
  [key: number]: number;
};

export default function Home() {
  const [goldPerTry, setGoldPerTry] = useState(500);
  const [setSignPrice, setSetSignPrice] = useState(24000);
  const [sphereSetPrice, setSphereSetPrice] = useState(8000);

  const [totalTries, setTotalTries] = useState(0);
  const [usedSigns, setUsedSigns] = useState(0);
  const [usedSpheres, setUsedSpheres] = useState(0);
  const [goldSpent, setGoldSpent] = useState(0);

  const [canStartEnchant, setCanStartEnchant] = useState(false);
  const [enchantItem, setEnchantItem] = useState<EnchantItem>({
    level: 0,
    failed: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
  });

  const [log, setLog] = useState<string[]>([]);

  function getChance(level: number) {
    const baseChances = [
      1.0, 0.09, 0.07, 0.035, 0.015, 0.01, 0.08, 0.004, 0.003, 0.002,
    ];
    const variation = 0.002;
    const min = Math.max(0, baseChances[level] - variation);
    const max = Math.min(1, baseChances[level] + variation);

    return Math.random() * (max - min) + min;
  }

  function enchant() {
    if (enchantItem.level >= 10) return;

    const chance = getChance(enchantItem.level);
    const success = Math.random() < chance;

    setTotalTries((t) => t + 1);
    setUsedSigns((s) => s + 1);
    setUsedSpheres((e) => e + 1);
    setGoldSpent((g) => g + goldPerTry);

    const newLevel = enchantItem.level + 1;
    const incrementFailed = enchantItem.failed + 1;

    if (success) {
      setEnchantItem((state) => ({
        ...state,
        failed: 0,
        level: newLevel,
      }));
      setLog((prev) => [
        `✔️ Sucesso! Nível ${enchantItem.level} → ${newLevel}`,
        ...prev,
      ]);
    } else {
      setEnchantItem((state) => ({
        ...state,
        failed: incrementFailed,
        [newLevel]: incrementFailed,
      }));
      setLog((prev) => [
        `❌ Falhou no nível ${enchantItem.level} (manteve com selo)`,
        ...prev,
      ]);
    }
  }

  function startEnchant() {
    setCanStartEnchant(true);
  }

  function resetEnchant() {
    setCanStartEnchant(false);
    setTotalTries(0);
    setUsedSigns(0);
    setUsedSpheres(0);
    setGoldSpent(0);
    setEnchantItem((state) => ({ ...state, level: 0, success: 0, failed: 0 }));
    setLog([]);
    setEnchantItem((state) => ({
      ...state,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
    }));
  }

  useEffect(() => {
    if (!canStartEnchant) return;

    if (enchantItem.level < 10) {
      const timeout = setTimeout(() => {
        enchant();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [enchantItem, canStartEnchant]);

  const totalSignsCost = (usedSigns / 10) * setSignPrice;
  const totalSpheresCost = (usedSpheres / 10) * sphereSetPrice;
  const totalGold = goldSpent + totalSignsCost + totalSpheresCost;

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6 text-white">
      <h2 className="text-xl font-bold">Simulador de Encantamento</h2>

      <div className="space-y-2 flex flex-col">
        <label>
          Gold por tentativa:
          <input
            type="number"
            defaultValue={goldPerTry}
            onChange={(e) => setGoldPerTry(Number(e.target.value))}
            className="ml-2 border border-white p-1 rounded-md w-20"
          />
        </label>
        <label>
          Preço do set de Sings (10 selos):
          <input
            type="number"
            value={setSignPrice}
            onChange={(e) => setSetSignPrice(Number(e.target.value))}
            className="ml-2 border border-white p-1 rounded-md w-20"
          />
        </label>
        <label>
          Preço do set de Esferas (10 esferas):
          <input
            type="number"
            value={sphereSetPrice}
            onChange={(e) => setSphereSetPrice(Number(e.target.value))}
            className="ml-2 border border-white p-1 rounded-md w-20"
          />
        </label>
      </div>

      <button onClick={startEnchant} className="bg-green-600 px-4 py-2 rounded">
        Iniciar
      </button>

      <button onClick={resetEnchant} className="bg-red-600 px-4 py-2 rounded">
        Resetar
      </button>

      <div className="mt-4 space-y-1">
        <p>
          <strong>Nível atual:</strong> +{enchantItem.level}
        </p>
        <p>
          <strong>Total de tentativas:</strong> {totalTries}
        </p>
        <p>
          <strong>Selos usados:</strong> {usedSigns} (
          {(usedSigns / 10).toFixed(1)} sets)
        </p>
        <p>
          <strong>Esferas usadas:</strong> {usedSpheres} (
          {(usedSpheres / 10).toFixed(1)} sets)
        </p>
        <p>
          <strong>Gold gasto (tentativas):</strong> {goldSpent.toLocaleString()}
          g
        </p>
        <p>
          <strong>Gold em selos:</strong> {totalSignsCost.toLocaleString()}g
        </p>
        <p>
          <strong>Gold em esferas:</strong> {totalSpheresCost.toLocaleString()}g
        </p>
        <p className="text-yellow-400">
          <strong>Total geral:</strong> {totalGold.toLocaleString()}g
        </p>

        <p>
          +1: <span className="text-red-500">{enchantItem[1]}</span> tentativas
          | {enchantItem[1] * goldPerTry}
        </p>
        <p>
          +2: <span className="text-red-500">{enchantItem[2]}</span> tentativas
          |{" "}
          <span className="text-yellow-400">
            <Minus size={14} className="inline text-red-500" />
            {enchantItem[2] * goldPerTry}
          </span>{" "}
          Gold por tentativa |{" "}
          <span>
            <Minus size={14} className="inline text-red-500" />
            {enchantItem[2] * (setSignPrice / 10)} Gold por sings
          </span>{" "}
          |{" "}
          <span>
            <Minus size={14} className="inline text-red-500" />
            {enchantItem[2] * (sphereSetPrice / 10)} Gold por esferas
          </span>
        </p>
        <p>
          +3: <span className="text-red-500">{enchantItem[3]}</span> tentativas
        </p>
        <p>
          +4: <span className="text-red-500">{enchantItem[4]}</span> tentativas
        </p>
        <p>
          +5: <span className="text-red-500">{enchantItem[5]}</span> tentativas
        </p>
        <p>
          +6: <span className="text-red-500">{enchantItem[6]}</span> tentativas
        </p>
        <p>
          +7: <span className="text-red-500">{enchantItem[7]}</span> tentativas
        </p>
        <p>
          +8: <span className="text-red-500">{enchantItem[8]}</span> tentativas
        </p>
        <p>
          +9: <span className="text-red-500">{enchantItem[9]}</span> tentativas
        </p>
        <p>
          +10: <span className="text-red-500">{enchantItem[10]}</span>{" "}
          tentativas
        </p>
      </div>

      <AnalysisOfEnchantment enchantItem={enchantItem} />

      <div className="mt-4 space-y-1">
        <h3 className="font-semibold text-lg">Registro:</h3>
        <ul className="text-sm max-h-72 overflow-y-auto">
          {log.map((line, index) => (
            <li
              key={index}
              className={
                line.includes("Sucesso") ? "text-green-400" : "text-red-400"
              }
            >
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
