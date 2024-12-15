import React, { useEffect, useState } from 'react';

const CarList = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch('http://localhost:555/cars')
      .then((response) => response.json())
      .then((data) => setCars(data))
      .catch((error) => console.error('Error fetching cars:', error));
  }, []);

  return (
    <div>
      <h1>Available Cars</h1>
      <ul>
        {cars.map((car) => (
          <li key={car.ID}>
            {car.MAKE} {car.MODEL} ({car.YEAR}) - ${car.PRICE_PER_DAY}/day
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarList;
