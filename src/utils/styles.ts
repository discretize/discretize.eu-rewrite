import iconSizes from "discretize-ui/react-discretize-components/src/helpers/iconSizes";

function getSizeStyle({ size }: { size?: string }) {
  const pixelSize = iconSizes[size] || "inherit";

  return { fontSize: pixelSize };
}

export { getSizeStyle };
