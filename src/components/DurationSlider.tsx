import { Flex, Slider, SliderThumb, SliderTrack } from '@chakra-ui/core';
import { useEffect, useState } from 'react';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
};

type DurationSliderProps = {
  initialValue: number;
  onChanged: (val: number) => void;
  minMax?: [number, number];
};
export const DurationSlider: React.FC<DurationSliderProps> = ({ initialValue, onChanged, minMax = [5, 60] }) => {
  const [duration, setDuration] = useState(initialValue);
  const debouncedDuration = useDebounce(duration, 800);

  useEffect(() => {
    if (debouncedDuration) {
      onChanged(debouncedDuration);
    }
  }, [debouncedDuration]);

  return (
    <div className="slider">
      <Flex justifyContent="center">
        <p>Around {duration} minutes</p>
      </Flex>
      <Slider value={duration} min={minMax[0]} max={minMax[1]} onChange={(e) => setDuration(Number(e))}>
        <SliderTrack bg={'grey'} />

        <SliderThumb size={6} bg={'black'} />
      </Slider>
    </div>
  );
};
