type Listener = () => void;
const listeners = new Set<Listener>();

export const emitSessionExpired = () => listeners.forEach((listener) => listener());

export const onSessionExpired = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
