"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface KeywordInputProps {
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
}

/* 
export type ControllerRenderProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
    onChange: (...event: any[]) => void;
    onBlur: Noop;
    value: FieldPathValue<TFieldValues, TName>;
    disabled?: boolean;
    name: TName;
    ref: RefCallBack;
};
*/

export function KeywordInput({
  value,
  onChange,
  className,
}: React.ComponentProps<"input">) {
  const [inputValue, setInputValue] = useState("");
  const keywords: string[] = (value as string[]) ?? [];
  const setKeywords = (ev: any, keywords: string[]) => {
    onChange?.({ ...ev, target: { value: keywords } });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!keywords.includes(inputValue.trim())) {
        setKeywords(e, [...keywords, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(
      {},
      keywords.filter((keyword) => keyword !== keywordToRemove),
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {keywords?.map((keyword) => (
          <Badge
            key={keyword}
            variant="secondary"
            className="px-2 py-1 text-sm"
          >
            {keyword}
            <button
              type="button"
              onClick={() => removeKeyword(keyword)}
              className="ml-1 rounded-full hover:bg-muted"
              aria-label={`Remove ${keyword}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        id="keywords"
        placeholder="Enter keywords and press Enter"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
