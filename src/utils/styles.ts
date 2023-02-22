import iconSizes from "discretize-ui/react-discretize-components/src/helpers/iconSizes";

function getSizeStyle({ size }) {
  const pixelSize = iconSizes[size] || "inherit";

  return { fontSize: pixelSize };
}

export { getSizeStyle };
