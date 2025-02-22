import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { FormValues } from "./form";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { RangeSlider } from "../ui/slider";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button.tsx";

export function AdditionalFilters() {
  const [min, setMin] = useState<string>("");
  const [max, setMax] = useState<string>("");
  const [vehicleClass, setVehicleClass] = useState<string[]>([]);
  const [vehicleMake, setVehicleMake] = useState<string[]>([]);
  const [passenger, setPassenger] = useState<number>(0);
  const [slider, setSlider] = useState<number[]>([0]);
  const form = useFormContext<FormValues>();

  const handleMinimumPassenger = (
    event: ChangeEvent<HTMLInputElement> | undefined,
  ) => {
    if (event) {
      form.setValue("minPassengers", parseInt(event.target.value));
      setPassenger(parseInt(event.target.value));
    }
  };

  const handleVehicleClass = (
    event: ChangeEvent<HTMLInputElement> | undefined,
  ) => {
    if (event && event.target.value.length !== 0) {
      form.setValue("classification", [event.target.value]);
      setVehicleClass([event.target.value]);
    } else {
      form.setValue("classification", []);
    }
  };

  const handleVehicleMake = (
    event: ChangeEvent<HTMLInputElement> | undefined,
  ) => {
    if (event && event.target.value.length !== 0) {
      form.setValue("make", [event.target.value]);
      setVehicleMake([event.target.value]);
    } else {
      form.setValue("make", []);
    }
  };

  const handleSlider = (value: number[]) => {
    if (value[0] <= 50) {
      form.setValue("price.0", value[0]);
      setMin(value[0].toString());
    }
    if (value[0] >= 50) {
      form.setValue("price.1", value[0]);
      setMax(value[0].toString());
    }
  };

  const resetFilter = () => {
    form.reset();
    setMin("");
    setMax("");
    setVehicleClass([]);
    setVehicleMake([]);
    setSlider([0]);
  };

  return (
    <div className="w-100">
      <Label>Hourly price range</Label>
      <div className="grid grid-cols-2">
        <FormField
          control={form.control}
          name="price.0"
          render={() => (
            <FormItem>
              <FormLabel>Min</FormLabel>
              <FormControl style={{ minWidth: "100px" }}>
                <Input
                  type="number"
                  min={0}
                  disabled
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price.1"
          render={() => (
            <FormItem className="ml-5">
              <FormLabel>Max</FormLabel>
              <FormControl style={{ minWidth: "100px" }}>
                <Input
                  type="number"
                  max={100}
                  disabled
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="mt-5">
        <FormField
          control={form.control}
          name="price"
          render={() => (
            <FormItem>
              <FormControl style={{ minWidth: "100px" }}>
                <RangeSlider
                  min={0}
                  max={100}
                  value={slider}
                  onValueChange={(value: number[]) => {
                    handleSlider(value);
                    if (value[0] <= 50) {
                      setMin(value[0].toString());
                    }
                    if (value[0] >= 50) {
                      setMax(value[0].toString());
                    }
                    setSlider(value);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="mt-5">
        <FormField
          control={form.control}
          name="minPassengers"
          render={() => (
            <FormItem>
              <FormLabel>Minimum passenger count</FormLabel>
              <FormControl style={{ minWidth: "100px" }}>
                <Input
                  type="number"
                  value={passenger}
                  onChange={handleMinimumPassenger}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="mt-5">
        <FormField
          control={form.control}
          name="classification"
          render={() => (
            <FormItem>
              <FormLabel>Vehicle class</FormLabel>
              <FormControl style={{ minWidth: "100px" }}>
                <Input
                  type="text"
                  value={vehicleClass}
                  onChange={handleVehicleClass}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="mt-5">
        <FormField
          control={form.control}
          name="make"
          render={() => (
            <FormItem>
              <FormLabel>Vehicle make</FormLabel>
              <FormControl style={{ minWidth: "100px" }}>
                <Input
                  type="text"
                  value={vehicleMake}
                  onChange={handleVehicleMake}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="mt-5">
        <Button onClick={resetFilter}>Reset filter</Button>
      </div>
    </div>
  );
}
