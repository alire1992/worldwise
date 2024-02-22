import { useContext } from "react";
import CitiesContext from "../contexts/CitiesContext";

const useCitiesContext = () => {
  const citiesContext = useContext(CitiesContext);
  if (citiesContext === undefined)
    throw new Error("using context out of Provider");
  return citiesContext;
};

export default useCitiesContext;
