import Image from "next/image";

export default function EfreiLogo({ width = 200, height = 200 }) {
  return (
    <div className="flex items-center gap-4">
      <Image src="/logomyEfrei.png" alt="logo" width={width} height={height} />
    </div>
  );
}
