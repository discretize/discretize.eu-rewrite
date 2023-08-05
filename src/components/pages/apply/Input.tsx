import React from "react";

export default function Input({
  label,
  onChange,
  value,
  placeholder,
  altLabel,
}: {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder: string;
  altLabel?: React.ReactNode;
}) {
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type="text"
        placeholder={placeholder}
        className="input input-bordered w-full max-w-xs"
        value={value}
        onChange={onChange}
      />
      {altLabel && (
        <label className="label">
          <span className="label-text-alt">{altLabel}</span>
        </label>
      )}
    </div>
  );
}
