import { Link } from "react-router-dom";

function StackCard({ researchData }) {
  return (
    <div className="flex flex-col gap-6">
      {researchData.map((item) => (
        <div
          key={item.id}
          className="bg-white shadow-md rounded-md p-4 border border-gray-200 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>

          <div className="mt-2 text-sm text-gray-600">
            <p>{item.authors?.join(", ")}</p>
            <p className="mt-1">{item.pub_date}</p>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              {item.types?.map((type) => (
                <span key={type} className="px-2 mr-2 py-1 bg-gray-200 rounded">
                  {type}
                </span>
              ))}
            </div>

            <Link
              to={`/publications/${item.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StackCard;
