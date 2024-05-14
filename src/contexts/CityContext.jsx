import { createContext, useContext, useEffect, useReducer } from "react";

const CityContext = createContext();

const BASE_URL = "http://localhost:9000";

const initialState = {
  isLoading: false,
  cities: [],
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities.filter((city) => city.id !== action.payload)],
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Unknown type error");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    dispatch({ type: "loading" });
    async function fetchCities() {
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
        // console.log(data);
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "there was error on isLoading...",
        });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
      // console.log(data);
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "An error occurred while fetching cities",
      });
    }
  }

  // Learn this for future
  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application.json",
        },
      });
      const data = await res.json();
      // Keeping UI state in sync with the remote State
      dispatch({ type: "city/created", payload: data });

      // console.log(data);
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "An error occurred while creating cities",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "Delete",
      });

      dispatch({
        type: "city/deleted",
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "An error occurred while deleting cities",
      });
    }
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

function useCities() {
  const context = useContext(CityContext);

  if (context === undefined)
    throw new Error("Context called outside of provider");

  return context;
}

export { CitiesProvider, useCities };
