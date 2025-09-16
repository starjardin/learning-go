export default function FeaturedProducts() {
  const products = [
    {
      label: "New",
      name: "Red T-shirt",
      description: "Comfortable Red T-shirt",
      price: "$19.99",
    },
    {
      label: "Best Seller",
      name: "Wireless Headphones",
      description: "High-Quality Wireless Headphones",
      price: "$99.99",
    },
    {
      label: "Discount",
      name: "Trendy Sneakers",
      description: "Stylish & Comfortable",
      price: "$49.99",
    },
  ];

  return (
    <section className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Product label */}
            <div className="bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {product.label}
            </div>

            {/* Product main content */}
            <div className="p-4 text-center">
              <h3 className="text-base font-medium mb-2">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{product.description}</p>
              <p className="text-lg font-semibold">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

