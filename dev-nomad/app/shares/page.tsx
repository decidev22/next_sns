import getCurrentUser from "@/app/actions/getCurrentUser";
import getSharingById from "@/app/actions/getSharingById";
import ClientOnly from "@/app/components/CilientOnly";
import EmptyState from "@/app/components/EmptyState";
import SharingClient from "./ShareClient";
import getReservation from "@/app/actions/getReservations";
import getSharings from "../actions/getSharings";

interface IParams {
  listingId?: string;
}

const SharingPage = async ({ params }: { params: IParams }) => {
  const listing = await getSharingById(params);
  const reservation = await getSharings(params);
  const currentUser = await getCurrentUser();
  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }
  return (
    <ClientOnly>
      <SharingClient
        sharing={listing}
        currentUser={currentUser}
        // reservation={reservation}
      />
    </ClientOnly>
  );
};

export default SharingPage;
