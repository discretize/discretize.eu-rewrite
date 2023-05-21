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

function findLastIndex(array, predicate) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = length;
  while (index--) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

function RelicsCalculatorImport(props) {
  const [state, setState] = React.useState({
    open: false,
    apiKey: "",
    saveLocally: true,

    isSubmitting: false,
    error: "",
  });

  const handleChange =
    (name, boolean = false) =>
    ({ target: { value, checked } }) =>
      setState({ ...state, [name]: boolean ? checked : value });

  const handleClickToggle = () => {
    setState({ ...state, open: !state.open });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const relicsFromWallet = (wallet) => {
    const { value: relics = 0 } =
      wallet.find(({ id }) => id === WALLET_RELICS_ID) || {};
    const { value: pristines = 0 } =
      wallet.find(({ id }) => id === WALLET_PRISTINES_ID) || {};

    return { relics: relics || 0, pristines: pristines || 0 };
  };

  const augmentFromTitles = (titles) =>
    Math.max(
      findLastIndex(MIST_ATTUNEMENTS, ({ id }) => titles.includes(id)) + 1,
      0
    );

  const readStorage = (bank, storage) => {
    const matrices =
      ((
        bank
          .filter((value) => !!value)
          .find(({ id }) => id === STORAGE_MATRICES_ID) || {}
      ).count || 0) +
      ((
        storage
          .filter((value) => !!value)
          .find(({ id }) => id === STORAGE_MATRICES_ID) || {}
      ).count || 0);
    const pages =
      ((
        bank
          .filter((value) => !!value)
          .find(({ id }) => id === STORAGE_PAGES_ID) || {}
      ).count || 0) +
      ((
        storage
          .filter((value) => !!value)
          .find(({ id }) => id === STORAGE_PAGES_ID) || {}
      ).count || 0);
    const { count: journals } =
      bank
        .filter((value) => !!value)
        .find(({ id }) => id === STORAGE_JOURNALS_ID) || {};

    return {
      matrices: matrices || 0,
      pages: pages || 0,
      journals: journals || 0,
    };
  };

  const importFromApi = async (apiKey) => {
    const { onImport } = props;
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
        axios.get(`${GW2_DOMAIN}account/titles`, {
          ...authHeader,
        }),
        axios.get(`${GW2_DOMAIN}account/wallet`, {
          ...authHeader,
        }),
        axios.get(`${GW2_DOMAIN}account/materials`, {
          ...authHeader,
        }),
        axios.get(`${GW2_DOMAIN}account/bank`, {
          ...authHeader,
        }),
      ]);

      onImport({
        ...relicsFromWallet(wallet.data),
        ...readStorage(bank.data, storage.data),
        augment: augmentFromTitles(titles.data),
      });

      setState({ ...state, isSubmitting: false, error: "" });
    } catch (error) {
      let message;

      if (error.response && error.response.status === 403) {
        message = "Insufficient permissions, check your API key";
      } else if (error.response && error.response.status === 429) {
        message = "Too many requests, retry later";
      } else if (error.response && error.response.status === 500) {
        message = "API error - maybe try again";
      } else {
        const { message: msg } = error;
        message = msg;
      }

      setState({ ...state, isSubmitting: false, error: message });
      throw error;
    }
    setState({ ...state, apiKey });
  };

  const handleSubmit = async (event) => {
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
    // reimport in case there was a key stored on the disk
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
          className={`btn btn-outline btn-info ${
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
          permissions. Your API key is only stored in your browser and only used
          to interact with the Guild Wars 2 API.
        </p>
        <div className="flex">
          <input
            type="text"
            placeholder="API Key"
            className={`input input-bordered w-full max-w-xs `}
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
