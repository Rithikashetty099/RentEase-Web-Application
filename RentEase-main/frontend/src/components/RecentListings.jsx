import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchListings } from "../service/apiListings";

const RecentListings = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recent-listings"],
    queryFn: () => fetchListings(),
  });
  const listings = (Array.isArray(data) ? data : data?.results || []).slice(0, 4);

  return (
    <section className="bg-rentease-dark py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="heading-secondary text-white mb-8">
          Recent <span className="text-rentease-yellow">Listings</span>
        </h2>
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-rentease-gray border border-rentease-lightgray p-4 animate-pulse">
                <div className="h-5 bg-rentease-lightgray mb-2" />
                <div className="h-4 bg-rentease-lightgray mb-3 w-2/3" />
                <div className="h-4 bg-rentease-lightgray w-1/2" />
              </div>
            ))}
          </div>
        )}
        {!isLoading && isError && (
          <p className="text-red-300">Unable to load recent listings.</p>
        )}
        {!isLoading && !isError && listings.length === 0 && (
          <p className="text-rentease-light">No recent listings yet.</p>
        )}
        {!isLoading && !isError && listings.length > 0 && <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {listings.map((item) => (
            <div key={item.id} className="bg-rentease-gray border border-rentease-lightgray p-4">
              <p className="text-white font-semibold truncate">
                <Link to={`/listings/${item.id}`} className="hover:text-rentease-yellow">
                  {item.title}
                </Link>
              </p>
              <p className="text-rentease-light text-sm mt-1">{item.location}</p>
              <div className="flex justify-between mt-3 items-center gap-2 flex-wrap">
                <span className="text-rentease-yellow font-bold">₹{item.price}</span>
                <div className="flex gap-2">
                  <Link to={`/listings/${item.id}`} className="text-xs text-rentease-light hover:text-rentease-yellow">
                    Details
                  </Link>
                  <Link to={`/post-request?listing=${item.id}`} className="text-xs text-rentease-yellow">
                    Request
                  </Link>
                </div>
              </div>
            </div>          ))}
        </div>}
      </div>
    </section>
  );
};

export default RecentListings;
