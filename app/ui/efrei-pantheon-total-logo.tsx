import Image from "next/image";

export default function EfreiPantheonTotalLogo({ width = 200, height = 200 }) {
    return (
        <div className="flex items-center gap-4">
            <Image src="/logo-efrei.png" alt="logo" width={width} height={height} />
        </div>
    );
}
