import { fromPromise, setup } from "xstate";

export const createSuggestionMachine = <T extends any>({ minLength = 3 }: { minLength?: number }) => {
  return setup({
    types: {
      context: {} as {
        query: string;
        suggestions: T[];
        error?: string;
        selected?: string;
      },
      events: {} as
        | { type: "TYPE"; value: string }
        | { type: "CLEAR" }
        | { type: "SELECT"; item: string }
        | { type: "FETCH.SUCCESS"; suggestions: string[] }
        | { type: "FETCH.ERROR"; error: string }
        | { type: "BLUR" }
        | { type: "FOCUS" }
        | { type: "REMOVE"; item: string },
    },
    guards: {
      hasMinLength: ({ context }) => context.query.length >= minLength,
    },
    actions: {
      updateQuery: ({ context, event }) => {
        if (event.type === "TYPE") {
          context.query = event.value;
        }
      },
      clearQuery: ({ context }) => {
        context.query = "";
        context.suggestions = [];
        context.selected = undefined;
      },
      updateSuggestions: ({ context, event }) => {
        // @ts-ignore
        context.suggestions = event.output;
      },
      selectAddress: ({ context, event }) => {
        if (event.type === "SELECT") {
          context.selected = event.item;
          context.query = event.item;
        }
      },
      removeSuggestion: ({ context, event }) => {
        if (event.type === "REMOVE") {
          context.suggestions = context.suggestions.filter((s) => s !== event.item);
        }
      },
      setError: ({ context, event }) => {
        // @ts-ignore
        context.error = event.error;
      },
    },
    actors: {
      fetchSuggestions: fromPromise<T[], { query: string }>(async () => {
        throw new Error("Not implemented");
        // const suggestions = await fetchSuggestions(input.query);
        // return suggestions;
      }),
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QEMIQE51gQQK4BcB7AY0IFsAHAGzHzADoBLCGgYgBUBNABQFEBtAAwBdRKAqFYjfI0IA7MSAAeiAIwBmDfQAcqgEwBWTQE5jAdm3qALHoA0IAJ6IAbFef0rq587Nn1fg31VAF9g+1QMLDwiUkoaOiYWMFYAMQB5AGEAVQBlIVEkEAkpGXlFFQQNLV1DE3NLG3snBEt3PWMvMz1BI1UrG1DwtExYHAIScmpaBgAzElxYSA4eARFFYulZBUKK1QMzY3pBCz3tQStjQUMmxFb6A09vIzMDZ17BkAiRsZjJ+Nn5osIKwAEIAGSyACV8utJJsyjs1OofPRnIZBJpnKozrobggLAZ6AdOpjLm4rB8vlFxrEpglIJs5FBlnwYYUNqVtqBdgcrPcTt5nJc9KozHjtM5BPR1AZtOZJa9BKLjJThtTfnFpvQGTImawMmDeNhoWt2XDOeU1FjDuiMVZ-KoMWYrHjjOp1ESOj4MSKzBjtKrIqNohNNfSIIzmeCoWzxOatpbKt4pQ8hX0McqjHjHZojo8XnofC8rAZA98Q7T-tqI7rmbGivGEdy1PtDsddLLzsKDHjDKp6LbVMYziK9P0A2FPmrgzS-lqdYw9fxVAU4yUE4ik1cdPoHuo9C9tAZro5EAcU-nh25nqXJ1SZxq6QwIGAAEaEXByYiL5lcVmmtd4S5ZRED0fcBxqC5JSPHxh3FfsDEEJDjjRQRnE0QIy3VUMn3oF930-b89WjE1VwbdcmxAhAwL0CD9CgwQYIObQ8WRQ4XiQ3dBW0PQxywh8cKrfCPy-H9WCUWB8GQBJkBmOh0AACkQwQAEpWHvH5BK1YTCJ-esOQ3ZtqPAvRIOMaDXmY10sSOSxND9LErD8Zx+M0ystRmWhiAACzEiB5AYRcADdCAAawYDSKznBJPPwHyfwQYKSGkrZ8n0xtgIqGi6LHczGMsuDT0qJDtHuOzHgeHEXLvac3Oi2YvN8vUwHQdBCHQehqGkuZ0DIehItnMMGripqoESuQQuIFL5DSgDyKAxMng8ZxtDMIUHl9QJXUCeh6NMP1TOPXjXKiob6Fi+K9T-VYyIMyiKiWtxVvWmxRS2oqNCPWz3WPN1TIPE7Btwi7RtBCFSNhCjMpcN5lue4wNre1Q8QeftkKVRjjH+jpAcfKtYFwKAYEksTrvSqHE2y0y9os2CWI+nwPXdH6LAsVbfFxrSEgJom4FrVgcl4Q0MnYcmFs3KmzNpqyPsdWi7P3DEOkMbQKRqoM6rOnnif5kixYtCWTKl-K6bxGwpUHPpEIsJVqqGDXTtw7W+bEg0jQhs0KcN2jqdy6XCuaM5CVWxD9DOc9rE59zubAGhiDoYEybmu7oYQUxSvM9m5WeEtnGzX6B0YmUHh6I8+PV8sgfx2OwHjpY3eNfXDKo9P6Ez3xs-8XPs0EN1C4abx2jedoo-q+hFjjhOwZjZOMsTVv24sBGu9ebMhylEtLECfZ9n9Uezpatr0BZG7IfFoyF5Wjvl+dVePrHKUEa384DGHJUzH33DD-a-VDUb2evYX2HG3K+S8c532aN4fsHEMbuisKtXQoRJxyEIC+eAhQBp42mGfA2RkAC0ecioEM-lWZgNAcHN12KKfsNReg0U8C6IqK1CRolDu6N4R43AkI8oCSAFD7pqDcO4N4aJVYHjeFcRhzReTShgehLw6hzLcPDJGfhqdsR7COMhGw-QVqeGsrRaCw5HRXDQhKZRz43wiSIlANRiZGiyzMG3dEOYvCWD8BY86jUfx2M3Padw+5aFYnUEec46htpSnRnsUyvdTITntpXLB3NCY6x8Z7c+VF4EeDQmOV+-hCwiggYge0fJHjJntFjJCehPET1rgnXxRkJQ2mUqZXw2N6bNFUPodwfp3FGE8McdQnjv7oAaVRJp0on5YjMF4C41hXR+A8KYN0iEZQSnOEg4IQA */
    id: "addressAutocomplete",
    initial: "idle",
    context: ({ input }) => ({
      query: (input as any)?.query ?? "",
      suggestions: [],
    }),
    on: {
      CLEAR: {
        target: ".idle",
        actions: "clearQuery",
      },
    },
    states: {
      idle: {
        on: {
          TYPE: {
            target: "editing",
            actions: "updateQuery",
          },
          FOCUS: "focused",
        },
      },
      focused: {
        on: {
          TYPE: {
            target: "editing",
            actions: "updateQuery",
          },
          BLUR: "idle",
        },
      },
      editing: {
        always: [
          {
            target: "debouncing",
            guard: "hasMinLength",
          },
          {
            target: "focused",
          },
        ],
        on: {
          TYPE: {
            actions: "updateQuery",
          },
          BLUR: "idle",
        },
      },
      debouncing: {
        after: {
          500: "fetching",
        },
        on: {
          TYPE: {
            target: "editing",
            actions: "updateQuery",
          },
          BLUR: "idle",
        },
      },
      fetching: {
        invoke: {
          src: "fetchSuggestions",
          input: ({ context }) => ({ query: context.query }),
          onDone: {
            target: "suggesting",
            actions: "updateSuggestions",
          },
          onError: {
            target: "error",
            actions: "setError",
          },
        },
        on: {
          TYPE: {
            target: "editing",
            actions: "updateQuery",
          },
          BLUR: "idle",
        },
      },
      suggesting: {
        on: {
          TYPE: {
            target: "editing",
            actions: "updateQuery",
          },
          SELECT: {
            target: "selected",
            actions: "selectAddress",
          },
          BLUR: "idle",
          REMOVE: {
            actions: "removeSuggestion",
          },
        },
      },
      selected: {
        on: {
          TYPE: {
            target: "editing",
            actions: "updateQuery",
          },
          BLUR: "idle",
        },
      },
      error: {
        on: {
          TYPE: {
            target: "editing",
            actions: "updateQuery",
          },
        },
      },
    },
  });
};
