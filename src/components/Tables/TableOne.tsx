import Image from "next/image";

const poachingCases = [
  {
    image: "/images/poachers/poacher-01.jpg",
    name: "John Doe",
    location: "Serengeti",
    date: "2024-10-15",
    items: "Ivory, Snare",
    status: "Arrested",
  },
  {
    image: "/images/poachers/poacher-02.jpg",
    name: "Jane Smith",
    location: "Kruger Park",
    date: "2024-10-12",
    items: "Rhino Horn",
    status: "Under Investigation",
  },
  {
    image: "/images/poachers/poacher-03.jpg",
    name: "Mike Johnson",
    location: "Masai Mara",
    date: "2024-10-10",
    items: "Elephant Tusk",
    status: "Fined",
  },
];

const PoachingCasesTable = () => {
  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
        Poaching Cases
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 sm:grid-cols-5">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Poacher
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Location
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Date
            </h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Items
            </h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Status
            </h5>
          </div>
        </div>

        {poachingCases.map((caseItem, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === poachingCases.length - 1
                ? ""
                : "border-b border-stroke dark:border-dark-3"
            }`}
            key={key}
          >
            <div className="flex items-center gap-3.5 px-2 py-4">
              <div className="flex-shrink-0">
                <Image
                  src={caseItem.image}
                  alt="Poacher"
                  width={48}
                  height={48}
                />
              </div>
              <p className="hidden font-medium text-dark dark:text-white sm:block">
                {caseItem.name}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {caseItem.location}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {caseItem.date}
              </p>
            </div>

            <div className="hidden items-center justify-center px-2 py-4 sm:flex">
              <p className="font-medium text-dark dark:text-white">
                {caseItem.items}
              </p>
            </div>

            <div className="hidden items-center justify-center px-2 py-4 sm:flex">
              <p
                className={`font-medium ${
                  caseItem.status === "Arrested"
                    ? "text-green-600"
                    : caseItem.status === "Under Investigation"
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {caseItem.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoachingCasesTable;
