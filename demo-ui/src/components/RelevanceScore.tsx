import { cn } from "@/lib/utils";

interface RelevanceScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const RelevanceScore = ({
  score,
  size = "md",
  className,
}: RelevanceScoreProps) => {
  const displayPercent = Math.round(score * 100);

  const dimensions = {
    sm: { size: 40, strokeWidth: 3, fontSize: "xs" },
    md: { size: 60, strokeWidth: 4, fontSize: "sm" },
    lg: { size: 80, strokeWidth: 5, fontSize: "base" },
  };

  const { size: pixelSize, strokeWidth, fontSize } = dimensions[size];
  const radius = (pixelSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - score);

  const getColor = (score: number) => {
    if (score < 0.4) return "text-red-500";
    if (score < 0.7) return "text-yellow-500";
    return "text-green-500";
  };

  const colorClass = getColor(score);

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative" style={{ width: pixelSize, height: pixelSize }}>
        {/* Background circle */}
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox={`0 0 ${pixelSize} ${pixelSize}`}
          className="rotate-[-90deg]"
        >
          <circle
            cx={pixelSize / 2}
            cy={pixelSize / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted opacity-20"
          />
          <circle
            cx={pixelSize / 2}
            cy={pixelSize / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${colorClass}`}
            style={{
              strokeDashoffset: circumference * (1 - score),
            }}
          />
        </svg>

        {/* Percentage text */}
        <div
          className={`absolute inset-0 flex items-center justify-center text-${fontSize} font-medium ${colorClass}`}
        >
          {displayPercent}%
        </div>
      </div>
    </div>
  );
};
