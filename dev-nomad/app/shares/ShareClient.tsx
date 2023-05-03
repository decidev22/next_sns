// "use client";

// import { useCallback, useState } from "react";
// import Heading from "../components/Heading";
// import Container from "../components/conainter";
// import { SafeSharing, SafeUser } from "../types";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import toast from "react-hot-toast";
// import ListingCard from "../components/listings/ListingCard";

// interface SharingClientProps {
//   listing: SafeSharing & {
//     user: SafeUser;
//   };
//   currentUser?: SafeUser | null;
// }
// const SharingClient: React.FC<SharingClientProps> = ({
//   currentUser,
// }) => {
//   const router = useRouter();
//   const [deletingId, setDeletingId] = useState("");
//   const onCancel = useCallback(
//     (id: string) => {
//       setDeletingId(id);
//       axios
//         .delete(`/api/sharing/${id}`)
//         .then(() => {
//           toast.success("Plan to Nomad cancelled");
//           router.push("/shares");
//         })
//         .catch((error) => {
//           toast.error(error?.response?.data?.error);
//         })
//         .finally(() => {
//           setDeletingId("");
//         });
//     },
//     [router]
//   );
//   return (
//     <Container>
//       <Heading
//         title="Shared Nomads"
//         subtitle="These are the places you shared to DevNomad."
//       />
//       <div
//         className="mt-10
//       grid
//       grid-cols-1
//       sm:grid-cols-2
//       md:grid-cols-3
//       lg:grid-cols-4
//       xl:grid-cols-5
//       2xl:grid-cols-6
//       gap-8
//       "
//       >
//         Sharing
//       </div>
//     </Container>
//   );
// };

// export default SharingClient;

"use client";

import Container from "@/app/components/conainter";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingReservation from "@/app/components/listings/ListingReservation";
import { categories } from "@/app/components/navbar/Categories";
import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeReservation, SafeSharing } from "@/app/types";
import { SafeUser } from "@/app/types";

import axios from "axios";
import {
  differenceInCalendarDays,
  eachDayOfInterval,
} from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Range } from "react-date-range";
import { toast } from "react-hot-toast";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface SharingClientProps {
  reservation?: SafeReservation[];
  sharing: SafeSharing & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
}

const SharingClient: React.FC<SharingClientProps> = ({
  sharing,
  currentUser,
  reservation = [],
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();
  const disabledDates = useMemo(() => {
    let dates: Date[] = [];
    reservation.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });

      dates = [...dates, ...range];
    });
    return dates;
  }, [reservation]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(sharing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    setIsLoading(true);
    axios
      .post("/api/reservations", {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: sharing?.id,
      })
      .then(() => {
        toast.success("Nomad reserved!");
        setDateRange(initialDateRange);
        router.push("/journey");
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [totalPrice, dateRange, sharing.id, currentUser, loginModal]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );
      if (dayCount && sharing.price) {
        setTotalPrice((dayCount + 1) * sharing.price);
      } else {
        setTotalPrice(sharing.price);
      }
    }
  }, [dateRange, sharing.price]);

  const category = useMemo(() => {
    return categories.find((item) => item.label === sharing.category);
  }, [sharing.category]);
  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={sharing.title}
            imageSrc={sharing.imageSrc}
            locationValue={sharing.locationValue}
            id={sharing.id}
            currentUser={currentUser}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
          <ListingInfo
            user={sharing.user}
            category={category}
            description={sharing.description}
            roomCount={sharing.roomCount}
            devCount={sharing.devCount}
            tableCount={sharing.tableCount}
            locationValue={sharing.locationValue}
          />
          <div
            className="
            order-first
            mb-10
            md:order-last
            md:col-span-3
            "
          >
            <ListingReservation
              price={sharing.price}
              totalPrice={totalPrice}
              onChangeDate={(value) => setDateRange(value)}
              dateRange={dateRange}
              onSubmit={onCreateReservation}
              disabled={isLoading}
              disabledDates={disabledDates}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SharingClient;
