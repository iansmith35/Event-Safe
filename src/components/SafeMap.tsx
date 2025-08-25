
import dynamic from "next/dynamic";

const MapImpl = dynamic(() => import("./UkHeatmap"), { ssr: false });


interface SafeMapProps {
  className?: string;
}


export default function SafeMap({ className = "rounded-lg border max-w-full h-96 mx-auto" }: SafeMapProps) {
  return <MapImpl className={className} />;

}