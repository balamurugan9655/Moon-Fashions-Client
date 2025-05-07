import React from 'react';
import { Form, Card } from 'react-bootstrap';

const FilterSidebar = ({
  minPrice,
  maxPrice,
  onPriceChange,
  selectedCategories,
  selectedBrands,
  selectedRatings,
  onCheckboxChange,
  products
}) => {
  const minGap = 100;

  const handleMinChange = (e) => {
    const value = parseInt(e.target.value);
    if (value <= maxPrice - minGap) {
      onPriceChange(value, maxPrice);
    }
  };

  const handleMaxChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= minPrice + minGap) {
      onPriceChange(minPrice, value);
    }
  };

  const uniqueCategories = [...new Set(products.map(p => p.category))];
  const uniqueBrands = [...new Set(products.map(p => p.brand))];

  return (
    <Card className="p-3">
      <h5>Filters</h5>

      {/* Price Filter */}
      <div className="mb-3">
        <Form.Label>Price</Form.Label>
        <div className="range-slider-wrapper">
          <div
            className="slider-track"
            style={{
              left: `${(minPrice / 100000) * 100}%`,
              right: `${100 - (maxPrice / 100000) * 100}%`
            }}
          ></div>

          <input
            type="range"
            min="0"
            max="100000"
            value={minPrice}
            onChange={handleMinChange}
            className="range-slider"
          />
          <input
            type="range"
            min="0"
            max="100000"
            value={maxPrice}
            onChange={handleMaxChange}
            className="range-slider"
          />
        </div>

        <div className="d-flex justify-content-between mt-2">
          <Form.Control
            type="number"
            value={minPrice}
            min="0"
            max={maxPrice - minGap}
            onChange={(e) => onPriceChange(parseInt(e.target.value), maxPrice)}
            style={{ width: '80px' }}
          />
          <Form.Control
            type="number"
            value={maxPrice}
            min={minPrice + minGap}
            max="100000"
            onChange={(e) => onPriceChange(minPrice, parseInt(e.target.value))}
            style={{ width: '100px' }}
          />
        </div>
        <div className="text-muted small mt-1">Showing: ₹{minPrice} to ₹{maxPrice}</div>
      </div>

      {/* Dynamic Category Filter */}
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        {uniqueCategories.map((category) => (
          <Form.Check
            key={category}
            type="checkbox"
            label={category}
            checked={selectedCategories.includes(category)}
            onChange={() => onCheckboxChange('category', category)}
          />
        ))}
      </Form.Group>

      {/* Dynamic Brand Filter */}
      <Form.Group className="mb-3">
        <Form.Label>Brand</Form.Label>
        {uniqueBrands.map((brand) => (
          <Form.Check
            key={brand}
            type="checkbox"
            label={brand}
            checked={selectedBrands.includes(brand)}
            onChange={() => onCheckboxChange('brand', brand)}
          />
        ))}
      </Form.Group>
      

      {/* Star Rating Filter */}
      <Form.Group className="mb-3">
        <Form.Label>Star Rating</Form.Label>
        <Form.Check
          type="checkbox"
          label="5★"
          checked={selectedRatings.includes('5')}
          onChange={() => onCheckboxChange('rating', '5')}
        />
        <Form.Check
          type="checkbox"
          label="4★ & above"
          checked={selectedRatings.includes('4')}
          onChange={() => onCheckboxChange('rating', '4')}
        />
        <Form.Check
          type="checkbox"
          label="3★ & above"
          checked={selectedRatings.includes('3')}
          onChange={() => onCheckboxChange('rating', '3')}
        />
      </Form.Group>

    </Card>
  );
};

export default FilterSidebar;
