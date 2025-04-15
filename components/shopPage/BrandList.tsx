import React from "react";
import Title from "../Title";
import { BRANDS_QUERYResult } from "@/sanity.types";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
interface Props {
  brands: BRANDS_QUERYResult;
  selectedBrand?: string | null;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string | null>>;
}

const BrandList = ({ brands, selectedBrand, setSelectedBrand }: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Brands</Title>
      <RadioGroup value={selectedBrand || ""} className="mt-2 space-y-1">
        {brands?.map((brand) => (
          <div
            key={brand?._id}
            onClick={() => setSelectedBrand(brand?.slug?.current as string)}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={brand?.slug?.current as string}
              id={brand?.slug?.current}
              className="rounded-sm"
            />
            <Label
              htmlFor={brand?.slug?.current}
              className={`${selectedBrand === brand?.slug?.current ? "font-semibold text-tech_orange" : "font-normal"}`}
            >
              {brand?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {selectedBrand && (
        <button
          onClick={() => setSelectedBrand(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-[1px] hover:text-tech_orange hoverEffect"
        >
          Reset selection
        </button>
      )}
    </div>
  );
};

export default BrandList;
