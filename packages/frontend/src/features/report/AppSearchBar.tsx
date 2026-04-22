import { SearchBar } from "#components/MUIDsfr.tsx";
import { searchStore } from "#components/SearchModal.tsx";
import { Flex } from "#components/ui/Flex.tsx";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useSelector } from "@xstate/store/react";
import { useRef } from "react";

export const AppSearchBar = ({
  inputRef,
  onClick,
}: {
  inputRef?: React.RefObject<HTMLInputElement>;
  onClick?: () => void;
}) => {
  const search = useSelector(searchStore, (state) => state.context.search);
  const setSearch = (search: string) => searchStore.send({ type: "setSearch", search });
  const searchInputRef = inputRef ?? useRef<HTMLInputElement>(null);

  return (
    <Flex
      sx={{
        ".fr-search-bar": { width: "100%" },
        ".fr-search-bar > div": { width: "100%" },
      }}
    >
      <SearchBar
        renderInput={(params) => (
          <div onClick={onClick}>
            <input
              id={params.id}
              className={cx(params.className)}
              placeholder={params.placeholder}
              type={params.type}
              value={search}
              ref={inputRef || searchInputRef}
              style={{ width: "100%" }}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  if (searchInputRef.current !== null) {
                    searchInputRef.current.blur();
                  }
                }
              }}
            />
          </div>
        )}
      />
    </Flex>
  );
};
