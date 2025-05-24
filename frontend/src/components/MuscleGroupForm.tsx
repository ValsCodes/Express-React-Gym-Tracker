import React from "react";
import { SlInput, SlButton} from "../components";

type Draft = { name: string };

export interface MuscleGroupFormProps {
  draft: Draft;
  onChange: (draft: Draft) => void;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  isProcessing?: boolean;
  confirmLabel?: string;
}

export const MuscleGroupForm: React.FC<MuscleGroupFormProps> = ({
  draft,
  onChange,
  onConfirm,
  onCancel,
  isProcessing = false,
  confirmLabel = "Confirm"
}) => {
  const handleInput = (e: CustomEvent) => {
    const value = (e.currentTarget as any).value as string;
    onChange({ name: value });
  };

  return (
    <div className="add-item-row">
      <div className="item-header">
        <SlInput
          value={draft.name}
          placeholder="Muscle Group"
          maxlength={20}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUp={(e) => e.stopPropagation()}
          onSlInput={handleInput}
        />
      </div>
      <div className="action-buttons">
        <SlButton
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUp={(e) => e.stopPropagation()}
          variant="success"
          disabled={!draft.name || isProcessing}
          onClick={onConfirm}
        >
          {confirmLabel}
        </SlButton>
        <SlButton
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUp={(e) => e.stopPropagation()}
          variant="danger"
          disabled={isProcessing}
          onClick={onCancel}>
          Cancel
        </SlButton>
      </div>
    </div>
  );
};