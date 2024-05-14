import { useCities } from "../contexts/CityContext";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";

function getUniqueCountry(cities) {
  const countries = cities.reduce((arr, city) => {
    // Check if the country of the current city already exists in the accumulator array
    if (!arr.some((el) => el.country === city.country)) {
      // If the country doesn't exist, add it to the accumulator array
      return [
        ...arr,
        { country: city.country, emoji: city.emoji, id: city.id },
      ];
    } else {
      // If the country already exists, just return the accumulator array unchanged
      return arr;
    }
  }, []);
  return countries;
}

function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities)
    return (
      <Message message="Add your first city by clicking a city on the map" />
    );

  const countries = getUniqueCountry(cities);
  //   console.log(` country:- ${countries}`);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.id} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
