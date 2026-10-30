import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus } from "lucide-react";

const portions = [
  { name: "Personal (4 Slides)", price: 0 },
  { name: "Medium (8 Slides)", price: 3 },
  { name: "Familiar (10 Slides)", price: 6 },
  { name: "Jumbo (12 Slides)", price: 10 },
];

export default function ProductDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const product = location.state?.product;

  const [quantity, setQuantity] = useState(1);
  const [selectedPortion, setSelectedPortion] = useState(0);

  if (!product) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-[430px] items-center justify-center">
        <div className="text-center">
          <p className="mb-3 text-sm text-gray-500">
            Product details not found.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg bg-[#ff5900] px-5 py-2 text-white"
          >
            Go Home
          </button>
        </div>
      </main>
    );
  }

  const basePrice = Number(
    String(product.price || "14").replace(/[^\d.]/g, ""),
  );

  const selectedPrice = portions[selectedPortion].price;
  const currentPrice = basePrice + selectedPrice;
  const totalPrice = currentPrice * quantity;

  const handleAddToCart = () => {
    navigate("/dashboard");
  };

  return (
    <main className="px-[17px] relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-hidden  bg-white text-[#303442]">
      {/* Product Image */}
      <div className="h-[223px] w-full overflow-hidden rounded-[35px] mt-3">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Price and Quantity */}
      <section className="mt-3 flex h-[41px] items-center justify-between border-b border-t border-[#F3DDD5]">
        <h2 className="font-bold text-2xl leading-[26px] tracking-[0%] align-middle text-[#E95322]">
          ₹{currentPrice.toFixed(2)}
        </h2>

        <div className="flex items-center gap-[9px]">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#F04D1B] text-white"
          >
            <Minus size={16} />
          </button>

          <span className="min-w-[10px] text-center font-medium font-normal text-[24px] leading-[100%] tracking-[0%] align-middle capitalize">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#F04D1B] text-white"
          >
            <Plus size={16} />
          </button>
        </div>
      </section>

      {/* Product Description */}
      <section className="py-[9px]">
        <h1 className="mt-2 font-semibold text-[#391713] text-xl leading-[100%] tracking-[0%] align-middle">
          {product.name || "Lorem ipsum dolor sit amet"}
        </h1>

        <p className="mt-2 font-light text-base leading-[95%] tracking-[-3%] text-[#391713]">
          {
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
          }
        </p>
      </section>

      {/* Portion Selection */}
      <section className="mt-5 mb-18">
        <h2 className="mb-[12px] font-semibold text-xl leading-[100%] tracking-[0%] text-[#391713] ">
          Personal portion
        </h2>

        <div className="space-y-[12px]">
          {portions.map((portion, index) => (
            <button
              key={portion.name}
              type="button"
              onClick={() => setSelectedPortion(index)}
              className="flex w-full items-center gap-[7px] text-left"
            >
              <span className="font-light text-sm leading-[14px] tracking-[0%] text-center text-[#391713]">
                {portion.name}
              </span>

              <span className="mb-[2px] flex-1 border-b border-dotted border-[#FFD8C7]" />

              <span className="font-light text-xs leading-[100%] tracking-[0%] align-middle text-[#391713]">
                ${portion.price.toFixed(2)}
              </span>

              <span
                className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border ${
                  selectedPortion === index
                    ? "border-[#F04D1B]"
                    : "border-[#E8A997]"
                }`}
              >
                {selectedPortion === index && (
                  <span className="h-[9px] w-[9px] rounded-full bg-[#F04D1B]" />
                )}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Add to Cart */}
      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2  px-[11px] pb-[16px] pt-[10px]">
        <button
          type="button"
          onClick={handleAddToCart}
          className="h-[48px] w-full rounded-[7px] bg-[#FF5900] text- font-semibold tracking-[0.5px] text-white
                   opacity-100 gap-2 left-5 top-[722px]"
        >
          Add to cart
        </button>
      </div>
    </main>
  );
}
