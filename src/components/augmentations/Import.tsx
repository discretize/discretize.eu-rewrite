import axios from "axios";
import React from "react";
import { MIST_ATTUNEMENTS } from "./RelicsData";

const GW2_DOMAIN = "https://api.guildwars2.com/v2/";

const WALLET_RELICS_ID = 7;
const WALLET_PRISTINES_ID = 24;

const STORAGE_MATRICES_ID = 79230;
const STORAGE_PAGES_ID = 73834;
const STORAGE_JOURNALS_ID = 75439;

const LOCAL_STORAGE_KEY = "discretize:augmentationsCalculator:apiKey";

interface State {
  open: boolean;
  apiKey: string;
  saveLocally: boolean;
  isSubmitting: boolean;
  error: string;
}

interface WalletItem {
  id: number;
  value: number;
}

interface StorageItem {
  id: number;
  count: number;
}

interface ImportData {
  relics: number;
  pristines: number;
  matrices: number;
  pages: number;
  journals: number;
  augment: number;
}

interface Props {
  onImport: (data: ImportData) => void;
}

function findLastIndex<T>(
  array: T[] | null,
  predicate: (value: T, index: number, obj: T[]) => boolean,
): number {
  const length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  let index = length;
  while (index--) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

function RelicsCalculatorImport({ onImport }: Props): JSX.Element {
  const [state, setState] = React.useState<State>({
    open: false,
    apiKey: "",
    saveLocally: true,
    isSubmitting: false,
    error: "",
  });

  const handleSaveLocally = (): void => {
    setState({ ...state, saveLocally: !state.saveLocally });
    if (!state.saveLocally) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const handleClickToggle = (): void => {
    setState({ ...state, open: !state.open });
  };

  const handleClose = (): void => {
    setState({ ...state, open: false });
  };

  const relicsFromWallet = (wallet: WalletItem[]) => {
    const { value: relics = 0 } =
      wallet.find(({ id }) => id === WALLET_RELICS_ID) || {};
    const { value: pristines = 0 } =
      wallet.find(({ id }) => id === WALLET_PRISTINES_ID) || {};

    return { relics: relics || 0, pristines: pristines || 0 };
  };

  const augmentFromTitles = (titles: number[]): number =>
    Math.max(
      findLastIndex(MIST_ATTUNEMENTS, ({ id }) => titles.includes(id)) + 1,
      0,
    );

  const readStorage = (bank: StorageItem[], storage: StorageItem[]) => {
    const matrices =
      ((
        bank
          .filter((value): value is StorageItem => !!value)
          .find(({ id }) => id === STORAGE_MATRICES_ID) || {}
      ).count || 0) +
      ((
        storage
          .filter((value): value is StorageItem => !!value)
          .find(({ id }) => id === STORAGE_MATRICES_ID) || {}
      ).count || 0);
    const pages =
      ((
        bank
          .filter((value): value is StorageItem => !!value)
          .find(({ id }) => id === STORAGE_PAGES_ID) || {}
      ).count || 0) +
      ((
        storage
          .filter((value): value is StorageItem => !!value)
          .find(({ id }) => id === STORAGE_PAGES_ID) || {}
      ).count || 0);
    const { count: journals = 0 } =
      bank
        .filter((value): value is StorageItem => !!value)
        .find(({ id }) => id === STORAGE_JOURNALS_ID) || {};

    return {
      matrices: matrices || 0,
      pages: pages || 0,
      journals: journals || 0,
    };
  };

  const importFromApi = async (apiKey: string): Promise<void> => {
    const { isSubmitting } = state;

    if (isSubmitting) {
      return;
    }

    setState({ ...state, isSubmitting: true, error: "" });
    try {
      const authHeader = {
        params: {
          access_token: apiKey,
        },
      };

      const [titles, wallet, storage, bank] = await Promise.all([
        axios.get<number[]>(`${GW2_DOMAIN}account/titles`, authHeader),
        axios.get<WalletItem[]>(`${GW2_DOMAIN}account/wallet`, authHeader),
        axios.get<StorageItem[]>(`${GW2_DOMAIN}account/materials`, authHeader),
        axios.get<StorageItem[]>(`${GW2_DOMAIN}account/bank`, authHeader),
      ]);

      onImport({
        ...relicsFromWallet(wallet.data),
        ...readStorage(bank.data, storage.data),
        augment: augmentFromTitles(titles.data),
      });

      setState({ ...state, isSubmitting: false, error: "" });
    } catch (error: any) {
      let message: string;

      if (error.response && error.response.status === 403) {
        message = "Insufficient permissions, check your API key";
      } else if (error.response && error.response.status === 429) {
        message = "Too many requests, retry later";
      } else if (error.response && error.response.status === 500) {
        message = "API error - maybe try again";
      } else {
        message = error.message || "Unknown error";
      }

      setState({ ...state, isSubmitting: false, error: message });
      throw error;
    }
    setState({ ...state, apiKey });
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    const { apiKey, saveLocally } = state;

    if (apiKey && saveLocally) {
      localStorage.setItem(LOCAL_STORAGE_KEY, apiKey);
    }

    try {
      await importFromApi(apiKey);
      handleClose();
    } catch (error) {
      // Noop
    }
  };

  React.useEffect(() => {
    const apiKey = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (apiKey) {
      importFromApi(apiKey);
    }
  }, []);

  return (
    <>
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleClickToggle}
          className={`btn btn-outline btn-primary ${
            state.isSubmitting ? "loading" : ""
          }`}
        >
          {state.isSubmitting ? "Importing..." : "Import from API"}
        </button>
      </div>

      <div className={state.open ? "" : "hidden"}>
        <p>
          To import your relevant account values, please enter your Guild Wars 2
          API key here. You need the inventories, unlocks and wallet
          permissions. You can store your API key in your browser for later use.
          The API key never leaves your browser asides from authenticating with
          the Guild Wars 2 API.
        </p>
        <div className="form-control max-w-xs mb-4">
          <label className="label cursor-pointer">
            <span className="label-text">Save locally</span>
            <input
              type="checkbox"
              checked={state.saveLocally}
              className="checkbox checkbox-primary"
              onChange={handleSaveLocally}
            />
          </label>
        </div>
        <div className="flex">
          <input
            type="text"
            placeholder="API Key"
            className="input input-bordered w-full max-w-xs"
            onChange={(event) =>
              setState({ ...state, apiKey: event.target.value })
            }
            value={state.apiKey}
          />

          <button
            className={`btn ${state.isSubmitting ? "loading" : ""}`}
            onClick={handleSubmit}
          >
            Import
          </button>
        </div>
      </div>
    </>
  );
}

export default RelicsCalculatorImport;
