import { Box, BoxProps, styled } from "@mui/material";
import { Flex } from "./ui/Flex";
import Button from "@codegouvfr/react-dsfr/Button";
import { createContext, useContext, useState } from "react";

export const Tabs = ({ options, control }: TabsProps) => {
  const [value, setValue] = control ?? useState(options[0].id);

  const onClick = (option: TabOption) => {
    setValue(option.id);
  };

  return (
    <TabContext.Provider value={{ value, setValue }}>
      <Flex flex="1" flexDirection="column" pb={{ xs: "16px", lg: "0" }}>
        <Flex flex="1" flexDirection={"row"} justifyContent={"center"} width="100%" height="56px" overflow="hidden">
          {options.map((option) => (
            <TabButton
              key={option.id}
              type="button"
              selected={value === option.id}
              onClick={() => onClick(option)}
              aria-controls={`tabpanel-${option.id}`}
              id={`tab-${option.id}`}
              {...option.props}
            >
              <Box sx={option.props}>{option.label}</Box>
            </TabButton>
          ))}
        </Flex>

        {options.every((o) => !!o.component) ? (
          <Box flex="1" width={{ xs: "100%", lg: "100%" }} alignSelf="center">
            {options.map((option) => (
              <TabPanel key={option.id} value={value} id={option.id}>
                {option.component}
              </TabPanel>
            ))}
          </Box>
        ) : null}
      </Flex>
    </TabContext.Provider>
  );
};

const TabContext = createContext<{ value: string; setValue: (value: string) => void } | null>(null);

export const useTabsContext = () => {
  const context = useContext(TabContext)!;
  return { tab: context.value, setTab: context.setValue };
};

type TabOption = {
  id: string;
  label: string;
  props: Omit<BoxProps, "onClick" | "ref">;
  component: React.ReactNode;
};
export type TabsProps = {
  options: TabOption[];
  control?: [string, (value: string) => void];
};

const TabPanel = (props: { children?: React.ReactNode; value: string; id: string }) => {
  const { children, value, id, ...rest } = props;

  return (
    <Box
      role="tabpanel"
      style={{ display: value !== id ? "none" : "block" }}
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      {...rest}
    >
      <Box>{children}</Box>
    </Box>
  );
};

const TabButton = styled(Button)<{ selected?: boolean }>(({ selected, theme }) => ({
  backgroundColor: selected ? "white" : "#ececfe",
  color: "black",
  fontSize: "16px",
  [theme.breakpoints.up("lg")]: {
    fontSize: "20px",
  },
  fontWeight: "bold",
  position: "relative",
  flex: "1",
  justifyContent: "start",
  textAlign: "left",
  zIndex: selected ? "2" : "1",
  height: "56px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  boxShadow: selected ? "6px 0px 10px 3px rgba(0, 0, 0, .05), -6px 0px 10px 3px rgba(0, 0, 0, .05)" : "none",
  ":hover": {
    backgroundColor: selected ? "white !important" : "#dadafd !important",
  },
}));
