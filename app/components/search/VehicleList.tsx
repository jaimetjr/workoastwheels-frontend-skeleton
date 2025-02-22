import { Pagination, trpc } from "@/trpc.ts";
import { useFormContext } from "react-hook-form";
import { combineDateTime, FormValues } from "@/components/search/form.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useMemo } from "react";
import { Link } from "react-router-dom";

function PaginationButtons({ data }: { data: Pagination }) {
  const form = useFormContext<FormValues>();
  const page = form.watch("page");

  return (
    <div className="flex justify-center mt-6">
      <Button
        variant="link"
        onClick={() => form.setValue("page", page - 1)}
        disabled={page === 1}
      >
        Previous
      </Button>
      <Button
        variant="link"
        onClick={() => form.setValue("page", page + 1)}
        disabled={page === data.totalPages}
      >
        Next
      </Button>
    </div>
  );
}

export function VehicleList() {
  const form = useFormContext<FormValues>();
  const startDate = form.watch("startDate");
  const startTime = form.watch("startTime");
  const endDate = form.watch("endDate");
  const endTime = form.watch("endTime");
  const minPassengers = form.watch("minPassengers");
  const classification = form.watch("classification");
  const make = form.watch("make");
  const price = form.watch("price");
  const page = form.watch("page");

  const startDateTime = useMemo(
    () => combineDateTime(startDate, startTime),
    [startDate, startTime],
  );
  const endDateTime = useMemo(
    () => combineDateTime(endDate, endTime),
    [endDate, endTime],
  );

  const [searchResponse] = trpc.vehicles.search.useSuspenseQuery(
    {
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      page: Number(page),
      passengerCount: Number(minPassengers),
      classification: classification,
      make: make,
      priceMin: price[0],
      priceMax: price[1],
    },
    {
      keepPreviousData: true,
    },
  );
  if (searchResponse.vehicles.length === 0) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-muted-foreground">
          No vehicles found. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 justify-between">
        {searchResponse.vehicles.map((vehicle) => {
          const bookNowParams = new URLSearchParams({
            id: vehicle.id,
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
          });
          return (
            <div key={vehicle.id} className="border p-5">
              <div className="flex flex-col items-center">
                <img
                  src={vehicle.thumbnail_url}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full max-w-[140px] rounded-full bg-blue-50 p-4 mb-4"
                />
              </div>
              <div className="flex flex-col ml-4 items-center md:items-start">
                <h2 className="text-3xl font-bold text-center md:text-left leading-tight">
                  {vehicle.make} {vehicle.model}
                </h2>
                <dl className="max-w-lg md:max-w-unset grid grid-cols-2 gap-12 mt-4">
                  <div>
                    <dt className="text-sm text-gray-600">Hourly Price</dt>
                    <dd>
                      ${parseFloat(vehicle.hourly_rate_cents.toString()) / 100}
                      /hr
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">
                      Maximum passenger capacity
                    </dt>
                    <dd>{vehicle.max_passengers}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <Button asChild className="mt-2 w-full sm:w-auto">
                  <Link
                    to={{
                      pathname: "review",
                      search: bookNowParams.toString(),
                    }}
                  >
                    Reserve now
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <PaginationButtons data={searchResponse.pagination} />
    </div>
  );
}
