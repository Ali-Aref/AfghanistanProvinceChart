import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import { AFGHANISTAN_VIEWBOX } from "../src/data/geometry.js";
import { AfghanistanMap } from "../src/index.js";

function getProvince(name: RegExp) {
  return screen.getByRole("button", { name });
}

describe("AfghanistanMap", () => {
  it("renders all 34 provinces with an accessible map label", () => {
    const { container } = render(<AfghanistanMap />);
    expect(container.querySelectorAll("[data-province-code]")).toHaveLength(34);
    expect(screen.getByRole("group", { name: /34 provinces/ })).toBeInTheDocument();
    expect(container.querySelector(".af-map__outline")).not.toBeNull();
  });

  it("fires click callbacks with canonical province metadata and selects", () => {
    const onProvinceClick = vi.fn();
    const onSelectionChange = vi.fn();
    render(
      <AfghanistanMap
        onProvinceClick={onProvinceClick}
        onSelectionChange={onSelectionChange}
      />,
    );

    const kabul = getProvince(/Kabul/);
    fireEvent.click(kabul);

    expect(onProvinceClick).toHaveBeenCalledTimes(1);
    const interaction = onProvinceClick.mock.calls[0]?.[0];
    expect(interaction?.code).toBe("AF-KAB");
    expect(interaction?.province.names.en).toBe("Kabul");
    expect(interaction?.source).toBe("pointer");
    expect(onSelectionChange).toHaveBeenCalledWith("AF-KAB");
    expect(kabul).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(kabul);
    expect(onSelectionChange).toHaveBeenLastCalledWith(null);
    expect(kabul).toHaveAttribute("aria-pressed", "false");
  });

  it("supports uncontrolled default selection", () => {
    render(<AfghanistanMap defaultSelectedProvince="AF-HER" />);
    expect(getProvince(/Herat/)).toHaveAttribute("aria-pressed", "true");
    expect(getProvince(/Kabul/)).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(getProvince(/Kabul/));
    expect(getProvince(/Kabul/)).toHaveAttribute("aria-pressed", "true");
    expect(getProvince(/Herat/)).toHaveAttribute("aria-pressed", "false");
  });

  it("supports controlled selection without internal state", () => {
    const onSelectionChange = vi.fn();
    const { rerender } = render(
      <AfghanistanMap selectedProvince={null} onSelectionChange={onSelectionChange} />,
    );
    const kabul = getProvince(/Kabul/);
    expect(kabul).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(kabul);
    expect(onSelectionChange).toHaveBeenCalledWith("AF-KAB");
    expect(kabul).toHaveAttribute("aria-pressed", "false");

    rerender(
      <AfghanistanMap selectedProvince="AF-KAB" onSelectionChange={onSelectionChange} />,
    );
    expect(getProvince(/Kabul/)).toHaveAttribute("aria-pressed", "true");
  });

  it("activates with Enter and Space", () => {
    const onProvinceClick = vi.fn();
    render(<AfghanistanMap onProvinceClick={onProvinceClick} />);
    const kabul = getProvince(/Kabul/);

    fireEvent.keyDown(kabul, { key: "Enter" });
    expect(onProvinceClick).toHaveBeenLastCalledWith(
      expect.objectContaining({ code: "AF-KAB", source: "keyboard" }),
    );

    fireEvent.keyDown(kabul, { key: " " });
    expect(onProvinceClick).toHaveBeenCalledTimes(2);
    expect(onProvinceClick.mock.calls[1]?.[0].source).toBe("keyboard");
  });

  it("moves roving focus with arrow keys", () => {
    const { container } = render(<AfghanistanMap />);
    const bal = getProvince(/Balkh/);
    expect(bal).toHaveAttribute("tabindex", "0");

    fireEvent.focus(bal);
    fireEvent.keyDown(bal, { key: "ArrowRight" });

    const focused = container.querySelector('[data-province-code][tabindex="0"]');
    expect(focused).not.toBeNull();
    expect(focused).not.toBe(bal);
  });

  it("shows a localized tooltip on keyboard focus", () => {
    render(<AfghanistanMap />);
    fireEvent.focus(getProvince(/Kabul/));

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("Kabul");
    expect(tooltip).toHaveAttribute("dir", "ltr");
  });

  it("renders RTL tooltips without mirroring geometry", () => {
    const { container } = render(<AfghanistanMap locale="prs" />);
    const kabul = screen.getByRole("button", { name: /کابل/ });
    fireEvent.focus(kabul);

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("کابل");
    expect(tooltip).toHaveAttribute("dir", "rtl");
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe(
      `0 0 ${AFGHANISTAN_VIEWBOX.width} ${AFGHANISTAN_VIEWBOX.height}`,
    );
  });

  it("supports custom tooltip content", () => {
    render(
      <AfghanistanMap renderTooltip={({ province }) => <span>Custom {province.code}</span>} />,
    );
    fireEvent.focus(getProvince(/Kabul/));
    expect(screen.getByRole("tooltip")).toHaveTextContent("Custom AF-KAB");
  });

  it("can hide tooltips and province labels", () => {
    const { container } = render(
      <AfghanistanMap showTooltip={false} showProvinceLabels={false} />,
    );
    fireEvent.focus(getProvince(/Kabul/));
    expect(screen.queryByRole("tooltip")).toBeNull();
    expect(container.querySelectorAll(".af-map__label")).toHaveLength(0);
  });

  it("renders province labels when requested", () => {
    const { container } = render(<AfghanistanMap showProvinceLabels locale="prs" />);
    expect(container.querySelectorAll(".af-map__label")).toHaveLength(34);
    expect(container.querySelector(".af-map__label")?.textContent).toBeTruthy();
  });

  it("applies color overrides as CSS custom properties", () => {
    const { container } = render(
      <AfghanistanMap
        width={500}
        height={320}
        colors={{ fill: "#123456", hoverFill: "#654321", borderWidth: 2 }}
      />,
    );
    const map = container.firstElementChild as HTMLElement;
    expect(map.style.getPropertyValue("--af-map-fill")).toBe("#123456");
    expect(map.style.getPropertyValue("--af-map-hover-fill")).toBe("#654321");
    expect(map.style.getPropertyValue("--af-map-border-width")).toBe("2px");
    expect(map.style.width).toBe("500px");
    expect(map.style.height).toBe("320px");
  });

  it("exposes a non-interactive presentation", () => {
    render(<AfghanistanMap interactive={false} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getAllByRole("img").length).toBe(34);
  });

  it("server-renders deterministically", () => {
    const html = renderToString(<AfghanistanMap locale="en" />);
    expect(html.match(/data-province-code/g)).toHaveLength(34);
    expect(html).toContain('aria-label="Kabul"');
  });

  it("hydrates server-rendered markup", async () => {
    const App = () => <AfghanistanMap defaultSelectedProvince="AF-KAB" />;
    const html = renderToString(<App />);
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(container, <App />);
    });
    expect(container.querySelectorAll("[data-province-code]")).toHaveLength(34);

    await act(async () => {
      root?.unmount();
    });
    container.remove();
  });
});
