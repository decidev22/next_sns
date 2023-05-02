import EmptyState from "../components/EmptyState";

import ClientOnly from "../components/CilientOnly";

import getCurrentUser from "../actions/getCurrentUser";

import getReservation from "../actions/getReservations";
import JourneyClient from "./JourneyClient";

const JourneyPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState
          title="Unauthorised access"
          subtitle="Please login"
        />
      </ClientOnly>
    );
  }

  const reservation = await getReservation({
    userId: currentUser.id,
  });

  if (reservation.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No journey planned"
          subtitle="Please make a reservation to see your journies."
        />
      </ClientOnly>
    );
  }
  return (
    <ClientOnly>
      <JourneyClient
        reservation={reservation}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default JourneyPage;
