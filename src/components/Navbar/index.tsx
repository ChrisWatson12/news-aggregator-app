export const Navbar = () => {
  return (
    <div className="fixed backdrop-blur py-4 top-0 z-40 w-full bg-appBgColor p-4">
      <nav
        className="w-[90%] text-lg font-medium flex flex-row items-center justify-between sm:h-10"
        aria-label="Global"
      >
        <div className="flex flex-shrink-0 flex-grow items-center lg:flex-grow-0">
          <div className="flex w-full items-center justify-between md:w-auto ">
            <h1 className="uppercase text-xl font-extrabold text-white hover:text-white">
              News Aggregator
            </h1>
          </div>
        </div>
      </nav>
    </div>
  );
};
