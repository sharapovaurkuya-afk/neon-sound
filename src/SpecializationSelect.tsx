
import { useState } from "react";
import "./SpecializationSelect.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const options = [
  { value: "vocals", label: "🎤 Вокал" },
  { value: "guitar", label: "🎸 Гитара" },
  { value: "piano", label: "🎹 Фортепиано" },
  { value: "drums", label: "🥁 Ударные" },
  { value: "other", label: "🎵 Другое" },
];

export default function SpecializationSelect({
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);

  const selected = options.find((item) => item.value === value);

  return (
    <div className="custom-select">
      <button
        type="button"
        className="custom-select-button"
        onClick={() => setOpen(!open)}
      >
        <span>{selected?.label ?? "Выберите специализацию"}</span>
        <span className={open ? "arrow rotated" : "arrow"}>⌄</span>
      </button>

      {open && (
        <div className="custom-select-menu">
          {options.map((item) => (
            <button
              type="button"
              key={item.value}
              className={`custom-select-option ${
                value === item.value ? "selected" : ""
              }`}
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
            >
              {item.label}
              {value === item.value && <span>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
