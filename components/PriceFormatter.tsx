import { twMerge } from "tailwind-merge";

interface Props {
  amount: number | undefined;
  className?: string;
}

const PriceFormatter = ({ amount, className }: Props) => {
  const formattedPrice = new Number(amount).toLocaleString("en-US", {
    currency: "USD",
    style: "currency",
    minimumFractionDigits: 2,
  });
  return (
    <span
      className={twMerge(
        "text-sm font-semibold text-tech_dark_color",
        className
      )}
    >
      {formattedPrice}
    </span>
  );
};

export default PriceFormatter;
