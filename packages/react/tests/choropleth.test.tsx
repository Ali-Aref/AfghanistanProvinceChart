import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AfghanistanChoropleth } from "../src/index.js";

const PARTIAL_DATA = {
  "AF-KAB": 100,
  "AF-HER": 0,
  "AF-BAL": null,
} as const;

function provincePath(container: HTMLElement, code: string): SVGPathElement {
  const path = container.querySelector<SVGPathElement>(`[data-province-code="${code}"]`);
  if (!path) throw new Error(`Missing path for ${code}`);
  return path;
}

describe("AfghanistanChoropleth", () => {
  it("colors provinces from data and leaves missing provinces distinct", () => {
    const { container } = render(<AfghanistanChoropleth data={PARTIAL_DATA} showLegend />);
    const kabul = provincePath(container, "AF-KAB");
    const herat = provincePath(container, "AF-HER");
    const balkh = provincePath(container, "AF-BAL");
    const bamyan = provincePath(container, "AF-BAM");

    expect(kabul.style.fill).toBe("rgb(15, 118, 110)");
    expect(herat.style.fill).toBe("rgb(223, 243, 239)");
    expect(balkh.style.fill).toBe("var(--af-map-no-data, #eef1f5)");
    expect(bamyan.style.fill).toBe("var(--af-map-no-data, #eef1f5)");
    expect(herat.style.fill).not.toBe(balkh.style.fill);
  });

  it("uses a custom missing color", () => {
    const { container } = render(
      <AfghanistanChoropleth data={PARTIAL_DATA} missingColor="#ff00aa" />,
    );
    expect(provincePath(container, "AF-KAB").style.fill).not.toBe("rgb(255, 0, 170)");
    expect(provincePath(container, "AF-BAM").style.fill).toBe("rgb(255, 0, 170)");
  });

  it("maps numeric values to accessible labels and tooltips", () => {
    const { container } = render(<AfghanistanChoropleth data={PARTIAL_DATA} />);
    const kabul = screen.getByRole("button", { name: /Kabul, Value: 100/ });
    expect(kabul).toBeInTheDocument();

    fireEvent.focus(kabul);
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("Kabul");
    expect(tooltip).toHaveTextContent("100");

    fireEvent.focus(screen.getByRole("button", { name: /Bamyan/ }));
    expect(screen.getByRole("tooltip")).toHaveTextContent("No data");
    expect(container).toBeTruthy();
  });

  it("supports custom value formatting in tooltip and legend", () => {
    const { container } = render(
      <AfghanistanChoropleth
        data={PARTIAL_DATA}
        showLegend
        formatValue={(value) => `${value} MW`}
      />,
    );
    fireEvent.focus(screen.getByRole("button", { name: /Kabul/ }));
    expect(screen.getByRole("tooltip")).toHaveTextContent("100 MW");
    expect(container.querySelector(".af-legend__endpoint")).toHaveTextContent("0 MW");
  });

  it("renders a legend that matches the domain", () => {
    const { container } = render(
      <AfghanistanChoropleth data={{ "AF-KAB": 10, "AF-HER": 250 }} showLegend />,
    );
    const endpoints = container.querySelectorAll(".af-legend__endpoint");
    expect(endpoints).toHaveLength(2);
    expect(endpoints[0]).toHaveTextContent("10");
    expect(endpoints[1]).toHaveTextContent("250");
    expect(container.querySelector(".af-legend__title")).toHaveTextContent("Value by province");
    expect(container.querySelector(".af-legend__missing")).toBeInTheDocument();
  });

  it("respects a fixed domain", () => {
    const { container } = render(
      <AfghanistanChoropleth
        data={{ "AF-KAB": 10, "AF-HER": 250 }}
        domain={[0, 1000]}
        showLegend
      />,
    );
    const endpoints = container.querySelectorAll(".af-legend__endpoint");
    expect(endpoints[0]).toHaveTextContent("0");
    expect(endpoints[1]).toHaveTextContent("1,000");
  });

  it("hides the legend by default", () => {
    const { container } = render(<AfghanistanChoropleth data={PARTIAL_DATA} />);
    expect(container.querySelector(".af-legend")).toBeNull();
  });

  it("localizes the legend and tooltip with RTL direction", () => {
    const { container } = render(
      <AfghanistanChoropleth data={PARTIAL_DATA} locale="prs" showLegend />,
    );
    expect(container.querySelector(".af-legend")).toHaveAttribute("dir", "rtl");
    expect(container.querySelector(".af-legend")).toHaveAttribute("lang", "fa-AF");
    expect(container.querySelector(".af-legend__title")).toHaveTextContent(
      "ارزش به تفکیک ولایت",
    );
    fireEvent.focus(screen.getByRole("button", { name: /کابل/ }));
    expect(screen.getByRole("tooltip")).toHaveAttribute("dir", "rtl");
  });

  it("localizes missing data, legend and labels in Pashto", () => {
    const { container } = render(
      <AfghanistanChoropleth data={PARTIAL_DATA} locale="ps" showLegend />,
    );
    const legend = container.querySelector(".af-legend");
    expect(legend).toHaveAttribute("dir", "rtl");
    expect(legend).toHaveAttribute("lang", "ps-AF");
    expect(legend).toHaveTextContent("معلومات نشته");
    expect(screen.getByRole("button", { name: /کندهار.*معلومات نشته/ })).toBeInTheDocument();
    fireEvent.focus(screen.getByRole("button", { name: /کندهار/ }));
    expect(screen.getByRole("tooltip")).toHaveTextContent("معلومات نشته");
  });

  it("handles negative values deterministically", () => {
    const { container, rerender } = render(
      <AfghanistanChoropleth data={{ "AF-KAB": -10, "AF-HER": 10 }} />,
    );
    const negative = provincePath(container, "AF-KAB").style.fill;
    const positive = provincePath(container, "AF-HER").style.fill;
    expect(negative).not.toBe(positive);

    rerender(<AfghanistanChoropleth data={{ "AF-KAB": -10, "AF-HER": 10 }} />);
    expect(provincePath(container, "AF-KAB").style.fill).toBe(negative);
  });

  it("keeps data colors when non-interactive", () => {
    const { container } = render(
      <AfghanistanChoropleth data={PARTIAL_DATA} interactive={false} />,
    );
    expect(provincePath(container, "AF-KAB").style.fill).toBe("rgb(15, 118, 110)");
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("supports selection callbacks", () => {
    const onSelectionChange = vi.fn();
    render(
      <AfghanistanChoropleth
        data={PARTIAL_DATA}
        selectedProvince="AF-KAB"
        onSelectionChange={onSelectionChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Kabul/ }));
    expect(onSelectionChange).toHaveBeenCalledWith(null);
  });
});
