/* eslint-disable react/prop-types */
import { useCallback, useEffect, useReducer } from "react";
import CitiesContext from "./CitiesContext";

const BASE_URL = "http://localhost:8000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loading":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loading":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/creating":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleting":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "reject":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

export default function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loading", payload: data });
      } catch {
        dispatch({
          type: "reject",
          payload: "There was an error in loading data...",
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function (id) {
      if (Number(id) === currentCity.id) return;
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/loading", payload: data });
      } catch {
        dispatch({
          type: "reject",
          payload: "There was an error in loading data...",
        });
      }
    },
    [currentCity.id]
  );
  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/creating", payload: data });
    } catch {
      dispatch({
        type: "reject",
        payload: "There was an error in Creating City.",
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleting", payload: id });
    } catch {
      dispatch({
        type: "reject",
        payload: "There was an error in Deleting City.",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
