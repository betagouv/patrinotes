import Button from "@codegouvfr/react-dsfr/Button";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { useState } from "react";
import { menuActor } from "../features/menu/menuMachine";
import { BoxProps, Typography } from "@mui/material";
import { Flex } from "./ui/Flex";

export const ChipGroup = ({
  options,
  isMulti,
  label,
  canBeEmpty = true,
  value,
  onChange,
  clauseId,
  className,
  disabled,
  ...props
}: {
  options: ChipGroupOption[];
  isMulti?: boolean;
  value?: string[];
  label?: string;
  canBeEmpty?: boolean;
  clauseId?: string;
  disabled?: boolean;
  onChange: (values: string[]) => void;
} & Omit<BoxProps, "onChange">) => {
  const [selectedOptions, setSelectedOptions] = useState(new Set(value ?? []));

  const values = Object.values(options);

  if (!values.length) return null;

  const ChipGroupList = (
    <Flex {...props} gap="8px" mt={label ? "8px" : 0} flexWrap="wrap">
      {values.map((option) => (
        <Chip
          key={option.key}
          isChecked={selectedOptions.has(option.key)}
          onCheckChange={(isChecked) => {
            if (disabled) return;
            const newSelectedOptions = new Set(selectedOptions);
            if (isChecked) {
              if (!isMulti) {
                newSelectedOptions.clear();
              }
              newSelectedOptions.add(option.key);
            } else if (selectedOptions.size > 1 || canBeEmpty) {
              newSelectedOptions.delete(option.key);
            }
            setSelectedOptions(newSelectedOptions);
            onChange?.(Array.from(newSelectedOptions));
          }}
        >
          {option.label}
        </Chip>
      ))}
    </Flex>
  );

  if (!label) return ChipGroupList;

  return (
    <Flex flexDirection="column" {...props} className={"fr-input-group"}>
      <Typography className="fr-label" component="label" display="flex" alignItems="center" mb="2px">
        {label}{" "}
        {clauseId ? (
          <Button
            iconId="ri-question-line"
            type="button"
            onClick={() => menuActor.send({ type: "GO_TO_CLAUSES", clause: { label, clauseId } })}
            priority="tertiary no outline"
          >
            {null}
          </Button>
        ) : null}
        {/* // <styled.span className="ri-question-line"></styled.span> */}
      </Typography>
      {ChipGroupList}
    </Flex>
  );
};

export type ChipGroupOption = {
  label: string;
  key: string;
};

export const Chip = ({
  children,
  onCheckChange,
  isChecked,
  className,
}: BoxProps & {
  isChecked?: boolean;
  className?: string;
  onCheckChange: (value: boolean) => void;
}) => {
  return (
    <Tag
      className={className}
      pressed={isChecked}
      aria-pressed={isChecked}
      nativeButtonProps={{
        onClick: () => onCheckChange(!isChecked),
        type: "button",
      }}
    >
      {children}
    </Tag>
  );
};

export const ControlledChip = ({
  children,
  onClick,
  isChecked,
}: {
  children: React.ReactNode;
  onClick: () => void;
  isChecked?: boolean;
}) => {
  return (
    <button
      className="fr-tag"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      type="button"
      aria-pressed={isChecked ? true : undefined}
    >
      {children}
    </button>
  );
};
