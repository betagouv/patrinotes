import { useMutation, useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import { AuthUser, type RouterOutputs } from "../api";
import { apiStore } from "../ApiStore";
import { db, useDbQuery } from "../db/db";
import { menuActor } from "../features/menu/menuMachine";
import { Center } from "#components/MUIDsfr.tsx";
import { Spinner } from "#components/Spinner.tsx";
import { Service } from "../db/AppSchema";
import { useNavigate } from "@tanstack/react-router";

const emptyAuth = {
  accessToken: null,
  expiresAt: null,
  refreshToken: null,
  user: null,
};

export const AuthContext = createContext<AuthContextProps>({
  auth: { ...emptyAuth },
  setAuth: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState<AuthContextProps["auth"]>({ ...emptyAuth });

  const loadAuthQuery = useQuery({
    queryKey: ["load-stored-auth"],
    queryFn: async () => {
      await apiStore.load();

      setAuth((auth) => ({
        ...auth,
        accessToken: apiStore.accessToken,
        expiresAt: apiStore.expiresAt,
        refreshToken: apiStore.refreshToken,
        user: apiStore.user,
      }));

      return apiStore;
    },
  });

  useEffect(() => {
    const version = localStorage.getItem("crvif/version");
    if (!version) {
      localStorage.removeItem("crvif/auth");
      localStorage.setItem("crvif/update-popup", "true");
      localStorage.setItem("crvif/version", "1");
      window.location.reload();
    }
  }, []);

  const setAuthAndSaveInStorage = (
    dataOrCallback: AuthContextProps["auth"] | ((old: AuthContextProps["auth"]) => AuthContextProps["auth"]),
  ) => {
    const values = typeof dataOrCallback === "function" ? dataOrCallback(auth) : dataOrCallback;
    setAuth(values);
    apiStore.accessToken = values.accessToken;
    apiStore.expiresAt = values.expiresAt;
    apiStore.refreshToken = values.refreshToken;
    apiStore.user = values.user as AuthUser;
    apiStore.save().then(() => console.log("auth saved to storage", new Date(Number(apiStore.expiresAt!))));
  };

  const value = {
    auth,
    setAuth: setAuthAndSaveInStorage,
  };

  if (loadAuthQuery.isLoading || !apiStore.loaded) {
    return (
      <Center height="100%">
        <Spinner />
      </Center>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

export const useIsLoggedIn = () => {
  const { auth } = useContext(AuthContext);
  return auth.accessToken && auth.user;
};

export const useLogout = () => {
  const { auth, setAuth } = useAuthContext();
  const navigate = useNavigate();

  return () => {
    menuActor.send({ type: "CLOSE" });
    setAuth({ ...auth, accessToken: null, user: null, refreshToken: null, expiresAt: null });
    navigate({ to: "/connexion" });
  };
};

export const useUser = () => {
  const { auth } = useAuthContext();
  return auth.user;
};

export const useLiveUser = () => {
  const user = useUser();

  const liveUsers = useDbQuery(
    db
      .selectFrom("user")
      .selectAll()
      .where("id", "=", user?.id ?? ""),
  );
  const liveUser = liveUsers.data[0];

  const liveServices = useDbQuery(
    db
      .selectFrom("service")
      .selectAll()
      .where("id", "=", liveUser?.service_id ?? ""),
  );
  const liveService = liveServices.data[0];

  if (!liveUser || !liveService) return user!;
  return { ...liveUser, service: liveService };
};

export const useService = () => {
  const user = useUser();

  return user!.service;
};

export const useLiveService = () => {
  const user = useUser();
  const serviceQuery = useDbQuery(db.selectFrom("service").where("id", "=", user!.service.id).selectAll());

  return serviceQuery.data?.[0];
};

export const useRefreshUser = () => {
  const { setAuth, auth } = useContext(AuthContext);
  const user = auth.user;

  const refreshUserMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const newUser = await db.selectFrom("user").selectAll().where("id", "=", user.id).executeTakeFirst();
      if (!newUser) return;
      const newService = await db
        .selectFrom("service")
        .selectAll()
        .where("id", "=", newUser.service_id)
        .executeTakeFirst();
      if (newService) (newUser as any).service = newService;

      setAuth({ ...auth, user: newUser as any });
    },
  });

  return refreshUserMutation;
};

export const useSetService = () => {
  const { setAuth } = useContext(AuthContext);

  return (service: AuthUser["service"]) =>
    setAuth((auth) => ({
      ...auth,
      user: { ...auth.user!, service_id: service.id, service: service },
    }));
};

type AuthContextProps = {
  auth: {
    accessToken: string | null;
    expiresAt: string | null;
    refreshToken: string | null;
    user: AuthUser | null;
  };
  setAuth: (
    dataOrCallback: AuthContextProps["auth"] | ((old: AuthContextProps["auth"]) => AuthContextProps["auth"]),
  ) => void;
};

// type AuthUser = Omit<RouterOutputs<"/api/authenticate">["user"], "service"> & {
//   service: Service;
// };
