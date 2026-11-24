import { useCallback, useState } from "react";
import type { ProvinceCode } from "../types/index.js";

export interface UseProvinceSelectionOptions {
  selectedProvince?: ProvinceCode | null | undefined;
  defaultSelectedProvince?: ProvinceCode | null | undefined;
  onSelectionChange?: ((code: ProvinceCode | null) => void) | undefined;
}

export interface ProvinceSelectionState {
  selectedProvince: ProvinceCode | null;
  setSelectedProvince: (code: ProvinceCode | null) => void;
  isControlled: boolean;
}

/**
 * Small controlled/uncontrolled selection helper shared by the map and
 * choropleth. Controlled mode is detected with `selectedProvince !== undefined`.
 */
export function useProvinceSelection({
  selectedProvince,
  defaultSelectedProvince,
  onSelectionChange,
}: UseProvinceSelectionOptions): ProvinceSelectionState {
  const isControlled = selectedProvince !== undefined;
  const [internalSelection, setInternalSelection] = useState<ProvinceCode | null>(
    defaultSelectedProvince ?? null,
  );

  const setSelectedProvince = useCallback(
    (code: ProvinceCode | null) => {
      if (!isControlled) setInternalSelection(code);
      onSelectionChange?.(code);
    },
    [isControlled, onSelectionChange],
  );

  return {
    selectedProvince: isControlled ? (selectedProvince ?? null) : internalSelection,
    setSelectedProvince,
    isControlled,
  };
}
