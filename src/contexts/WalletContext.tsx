import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { send } from "../utils/message";
import { User } from "../types/user";
import { Message } from "../messaging/Action";

export type State = {
  isPhantomAvailable: boolean;
  isWalletConnected: boolean;
  publicKey?: string;

  tokenJwt?: string;
  user?: User;
};

type WalletContextProps = State & {
  connectWallet: () => void;
  hasAccess: boolean;
  isLoading: boolean;
  token?: string;
  isConnected: boolean;
  isConnecting: boolean;
  refresh: () => void;
  isRefreshing: boolean;
};

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [state, setState] = useState<State | null>();
  const [hasAccess, setHasAccess] = useState(false);
  const [tokenJwt, setTokenJwt] = useState<string | null>(null);
  const [isConnecting, setConnecting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const connect = () => {
    setConnecting(true);
    send("background", "connect");
  };

  useEffect(() => {
    send("background", "initStatus");

    const messageListener = (message: Message) => {
      if (message.target === "popup") {
        setIsLoading(false);

        console.debug("Received ", message);
        if (message.action == "solanaStatus") {
          const tmp = message.data;
          setState(tmp);

          if (tmp.tokenJwt) setTokenJwt(tmp.tokenJwt);
          if (tmp.user) setUser(tmp.user);
        } else if (message.action == "loginStatus") {
          const tmp = message.data;
          setConnecting(tmp.isConnecting);

          if (tmp.tokenJwt) {
            setTokenJwt(tmp.tokenJwt);
          }

          if (tmp.user) {
            setUser(tmp.user);
          }

          if (tmp.error) alert(tmp.error);
        }
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const refresh = () => {
    if (tokenJwt) {
      setIsRefreshing(true);
      fetch(process.env.API_URL + "/api/me?refresh=true", {
        headers: {
          Authorization: "Bearer " + tokenJwt,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.error) {
            send("background", "syncUser", null);
          } else {
            send("background", "syncUser", json);
          }

          setIsRefreshing(false);
        })
        .catch((e) => {
          setIsRefreshing(false);
          console.error(e);
          alert("An error occured, please try again later");
        });
    }
  };

  useEffect(() => {
    refresh();
  }, [tokenJwt]);

  useEffect(() => {
    if (user) {
      setHasAccess(user.hasAccess);
    } else {
      setHasAccess(false);
    }
  }, [user]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isLoading) {
      intervalRef.current = setInterval(() => {
        send("background", "initStatus");
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLoading, send]);

  return (
    <WalletContext.Provider
      value={{
        ...(state == null
          ? {
              isWalletConnected: false,
              isPhantomAvailable: false,
            }
          : state),
        isLoading,
        connectWallet: connect,
        hasAccess,
        token: tokenJwt || undefined,
        isConnected: tokenJwt != null,
        isConnecting,
        isRefreshing,
        refresh,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextProps => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export default WalletContext;
