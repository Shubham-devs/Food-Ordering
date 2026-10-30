import { useEffect, useState } from "react";
import { FaPhoneSlash } from "react-icons/fa6";
import { GiWallet } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { getRestaurants } from "../api/restaurants";
import image1 from "../assets/Rectangle 133.png";
import image2 from "../assets/Rectangle 134.png";
import image3 from "../assets/Rectangle 135 A.png";
import image4 from "../assets/Rectangle 136 A.png";
import image5 from "../assets/Photo Pizza.png";
import image6 from "../assets/Rectangle 135.png";
import image7 from "../assets/Rectangle 136.png";

const bestSellers = [
  {
    id: "food-101",
    name: "Sushi Roll",
    price: "$103.0",
    image: image1,
  },
  {
    id: "food-102",
    name: "Chicken Curry",
    price: "$50.0",
    image: image2,
  },
  {
    id: "food-103",
    name: "Vegetable Lasagna",
    price: "$12.99",
    image: image3,
  },
  {
    id: "food-104",
    name: "Berry Cupcake",
    price: "$8.20",
    image: image4,
  },
];

const banners = [
  {
    id: "banner-101",
    subtitle: "Make every meal special",
    discount: "15% OFF",
    image: image1,
    name: "Sushi Roll",
    price: "$103.0",
  },
  {
    id: "banner-102",
    subtitle: "Enjoy your favourite meals",
    discount: "20% OFF",
    image: image2,
    name: "Chicken Curry",
    price: "$50.0",
  },
  {
    id: "banner-103",
    subtitle: "Fresh food, amazing taste",
    discount: "40% OFF",
    image: image3,
    name: "Vegetable Lasagna",
    price: "$12.99",
  },
  {
    id: "banner-104",
    subtitle: "Delicious food for everyone",
    discount: "25% OFF",
    image: image4,
    name: "Berry Cupcake",
    price: "$8.20",
  },
  {
    id: "banner-105",
    subtitle: "Experience our delicious new dish",
    discount: "30% OFF",
    image: image5,
    name: "Cheese Pizza",
    price: "$103.0",
  },
];

const popularItems = [
  {
    name: "Strawberry Shake",
    date: "29 Nov, 01:20 pm",
    price: "₹20.00",
    quantity: "2 items",
    image: image6,
  },
  {
    name: "Chicken Burger",
    date: "17 Oct, 01:20 pm",
    price: "₹20.00",
    quantity: "1 item",
    image: image7,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showRestaurants, setShowRestaurants] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [user] = useState(
    () => localStorage.getItem("userName") || "Guest1325646",
  );

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getRestaurants();

        console.log("Full API Response:", data);
        console.log("Restaurant Data:", data?.data);
        setRestaurants(data?.data?.results || []);
      } catch (err) {
        if (err.message === "Authentication required. Please login.") {
          navigate("/login", { replace: true });
          return;
        }

        setError(err.response?.data?.message || "Failed to fetch restaurants.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // go to the cart page with id
  const handleProductClick = (product, source) => {
    navigate("/card", {
      state: {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        },
        source,
      },
    });
  };

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-hidden  bg-white text-[#303442] ">
      {/* Loading State */}
      {loading && (
        <div className="flex min-h-dvh items-center justify-center">
          <p className="text-center text-bold text-[25px] font-medium text-gray-500">
            Loading restaurants...
          </p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex min-h-dvh items-center justify-center px-6">
          <p className="text-center text-bold text-[25px] font-medium text-red-500">
            {error}
          </p>
        </div>
      )}

      {/* Success State */}
      {!loading && !error && (
        <>
          {/* Location Header */}
          {/* <header className="border-b border-[#e2e2e2] px-3 pt-3 pb-3">
            <p className="text-[12px] font-normal leading-[100%] tracking-[0%] text-[#999999]">
              Current Locations
            </p>

            <button className=" flex items-center gap-1 text-[12px] font-medium leading-[100%] tracking-[0%]">
              Model Town, New Delhi
            </button>
          </header> */}
          {/* Restaurant Selection */}
          <header className="relative border-b border-[#e2e2e2] px-3 pt-3 pb-3">
            <p className="text-[12px] font-normal text-[#999999]">
              Current Locations
            </p>

            <button className="mt-1 flex items-center gap-1 text-[12px] font-medium leading-[100%] tracking-[0%]">
              Model Town, New Delhi
            </button>

            <button
              type="button"
              onClick={() => setShowRestaurants(!showRestaurants)}
              className="mt-1 flex w-full items-center justify-between text-left"
            >
              <span className="flex items-center gap-2">
                {selectedRestaurant?.logo && (
                  <>
                    <img
                      src={selectedRestaurant.logo}
                      alt={selectedRestaurant.restaurant_name}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextSibling.style.display = "flex";
                      }}
                      className="h-[28px] w-[28px] rounded-full object-cover"
                    />
                    <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFE1D5] text-[9px] font-bold text-[#E95322]">
                      {selectedRestaurant.restaurant_name
                        ?.trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((word) => word[0].toUpperCase())
                        .join("")}
                    </div>
                  </>
                )}

                <span>
                  <span className="block text-[12px] font-semibold">
                    {selectedRestaurant?.restaurant_name || "Select Restaurant"}
                  </span>

                  <span className="block max-w-[280px] truncate text-[10px] text-[#999999]">
                    {selectedRestaurant?.address_complete !== "null"
                      ? selectedRestaurant?.address_complete
                      : "Address unavailable"}
                  </span>
                </span>
              </span>

              <span className="text-[12px]">⌄</span>
            </button>

            {showRestaurants && (
              <div className="absolute top-full right-3 left-3 z-50 max-h-[250px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {restaurants.map((restaurant) => (
                  <button
                    key={restaurant.restaurant_id}
                    type="button"
                    onClick={() => {
                      setSelectedRestaurant(restaurant);
                      setShowRestaurants(false);
                    }}
                    className="flex w-full items-center gap-3 border-b border-gray-100 p-3 text-left hover:bg-gray-50"
                  >
                    <img
                      src={restaurant.logo}
                      alt={restaurant.restaurant_name}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextSibling.style.display = "flex";
                      }}
                      className="h-10 w-10 rounded-full object-cover"
                    />

                    <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFE1D5] text-[9px] font-bold text-[#E95322]">
                      {restaurant.restaurant_name
                        ?.trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((word) => word[0].toUpperCase())
                        .join("")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold">
                        {restaurant.restaurant_name}
                      </p>

                      <p className="truncate text-[10px] text-gray-500">
                        {restaurant.address_complete === "null"
                          ? "Address unavailable"
                          : restaurant.address_complete}
                      </p>
                    </div>

                    {selectedRestaurant?.restaurant_id ===
                      restaurant.restaurant_id && (
                      <span className="text-[#ff5b19]">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </header>

          {/* Search and Actions */}
          <section className="flex items-center justify-between gap-3 px-3 py-2">
            <div className="-mt-[8px] flex h-[45px] w-[60%] items-center rounded-b-[18px] bg-[#fafafa] px-3">
              <p className="w-full bg-transparent text-[14px] outline-none text-[#858585]">
                {user}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                aria-label="Food services"
                className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-gradient-to-br from-[#ff9c80] to-[#ff695c] text-white"
              >
                <FaPhoneSlash size={19} strokeWidth={2.5} />
              </button>

              <button
                aria-label="Wallet"
                className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] bg-gradient-to-br from-[#8bc5f3] to-[#416ed1] text-white"
              >
                <GiWallet size={19} strokeWidth={2.5} />
              </button>
            </div>
          </section>

          {/* Best Seller */}
          <section className="mt-2">
            <h2 className="px-[18px] text-[20px] leading-[100%] font-bold text-[#39201c]">
              Best Seller
            </h2>

            <div className="mt-2 flex gap-2 overflow-x-auto px-[18px] pb-1 [scrollbar-width:none]">
              {bestSellers.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleProductClick(item, "best-seller")}
                  className="relative h-[108px] min-w-[52px] flex-1 overflow-hidden rounded-[19px]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />

                  <span className="absolute right-0 bottom-2 rounded-l-[5px] bg-[#ff5b13] px-1 py-[2px] text-[9px] font-bold text-white">
                    {item.price}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Promotional Banner */}
          <section className="relative mx-[18px] mt-3 h-[141px] overflow-hidden rounded-[14px] bg-[#f14c17]">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => handleProductClick(banner, "banner")}
                className={`absolute inset-0 flex w-full text-left transition-all duration-700 ease-in-out ${
                  activeBanner === index
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                }`}
              >
                {/* Banner Text */}
                <div className="relative z-10 flex w-[46%] flex-col justify-center px-3 text-white">
                  <p className="font-normal text-base leading-[100%] tracking-[0%] text-center align-middle">
                    {banner.subtitle}
                  </p>

                  <h2 className="mt-1 font-bold text-[32px] leading-[100%] tracking-[0%] text-center align-middle">
                    {banner.discount}
                  </h2>
                </div>

                {/* Banner Image */}
                <div className="w-[54%] overflow-hidden">
                  <img
                    src={banner.image}
                    alt="Food promotion"
                    className="h-full w-full object-cover"
                  />
                </div>
              </button>
            ))}

            <span className="absolute -top-3 left-[35%] z-20 h-7 w-7 rounded-full border-[5px] border-[#ffdc80]" />
            <span className="absolute -bottom-3 left-2 z-20 h-7 w-7 rounded-full border-[5px] border-[#ffdc80]" />
          </section>

          {/* Banner Indicators */}
          <div className="mt-2 flex justify-center gap-1">
            {banners.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show banner ${index + 1}`}
                onClick={() => setActiveBanner(index)}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  activeBanner === index
                    ? "w-[25px] bg-[#ff5b25]"
                    : "w-[15px] bg-[#f5dba0]"
                }`}
              />
            ))}
          </div>

          {/* Popular Items */}
          <section className="mt-8 px-[17px]">
            <h2 className="mb-3 font-bold text-xl leading-[100%] text-[#391713]">
              Popular Items
            </h2>

            <div className="space-y-3">
              {popularItems.map((item) => (
                <article
                  key={item.name}
                  className="flex gap-[20px] border-b border-[#f1d9d0] pb-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-[108px] w-[71px] shrink-0 rounded-[12px] object-cover"
                  />

                  <div className="min-w-0 flex-1 pt-2">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="truncate font-bold text-xl leading-[100%] text-[#391713]">
                        {item.name}
                      </h3>

                      <span className="shrink-0 font-medium text-xl leading-[100%] tracking-[0%] text-right text-[#E95322]">
                        {item.price}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-light text-sm leading-[14px] text-[#391713]">
                        {item.date}
                      </span>

                      <span className="font-light text-sm leading-[14px]  text-[#391713]">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-1">
                      <button className="rounded-full bg-[#E95322] px-3 py-[4px] font-medium text-[15px] leading-5 tracking-[-0.5%] text-center text-white">
                        Cancel Order
                      </button>

                      <button className="rounded-full bg-[#FFDECF] px-3 py-[4px] font-medium text-[15px] leading-5 tracking-[-0.5%] text-center text-[#ff572b]">
                        Track Driver
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
