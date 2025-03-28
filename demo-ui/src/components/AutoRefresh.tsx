"use client";

import { useState, useEffect, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

interface AutoRefreshProps {
  initialEnabled?: boolean;
  interval?: number; // in seconds
  className?: string;
  label?: string;
}

export function AutoRefresh({
  initialEnabled = false,
  interval = 10,
  className = "",
  label = "Auto-refresh",
}: AutoRefreshProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [countdown, setCountdown] = useState(interval);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-refresh timer
  useEffect(() => {
    if (enabled) {
      setCountdown(interval);

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            window.location.reload();
            return interval;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(countdownInterval);
      };
    }
  }, [enabled, interval]);

  // Handle toggle change
  const handleToggleChange = (checked: boolean) => {
    setEnabled(checked);
    if (!checked && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {enabled && (
        <span className="text-sm text-muted-foreground">
          Refreshing in {countdown}s
        </span>
      )}
      <div className="flex items-center space-x-2">
        <Switch
          id="auto-refresh-toggle"
          checked={enabled}
          onCheckedChange={handleToggleChange}
        />
        <Label htmlFor="auto-refresh-toggle" className="text-sm">
          {label}
        </Label>
      </div>
    </div>
  );
}
