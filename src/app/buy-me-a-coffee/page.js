export default function BuyMeACoffeePage() {
  return (
    <div className="max-w-2xl mx-auto py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Support Kernel Compass</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300">
        If our content helps you on your journey abroad, consider buying us a coffee!
      </p>
      <a
        href="https://www.buymeacoffee.com/YOUR_ID"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me A Coffee"
          className="h-12 mx-auto"
        />
      </a>
    </div>
  );
}