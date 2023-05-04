import getCurrentUser from "@/app/actions/getCurrentUser";

import ClientOnly from "@/app/components/CilientOnly";
import EmptyState from "@/app/components/EmptyState";
import getFavoriteListings from "../actions/getFavoriteListings";
import FavoritesClient from "./FavoritesClient";

const ListingPage = async () => {
  const listings = await getFavoriteListings();
  const currentUser = await getCurrentUser();
  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No favorites found"
          subtitle="Click on the save icon to add your favorite nomads."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <FavoritesClient
        listings={listings}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default ListingPage;
