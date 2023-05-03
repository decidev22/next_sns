// import prisma from "@/app/libs/prismadb";
// export default async function getSharings() {
//   try {
//     const sharings = await prisma.sharing.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//     const safeSharings = sharings.map((sharing) => ({
//       ...sharing,
//       createdAt: sharing.createdAt.toISOString(),
//     }));
//     return safeSharings;
//   } catch (error: any) {
//     throw new Error(error);
//   }
// }

import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string; //check reservation of listing
  userId?: string; // check user's reservation
  authorId?: string; //check reservation of host's nomad
}

export default async function getSharings(params: IParams) {
  try {
    const { listingId, userId, authorId } = params;

    const query: any = {};

    if (listingId) {
      query.listingId = listingId;
    }
    if (userId) {
      query.userId = userId;
    }
    if (authorId) {
      query.listing = { userId: authorId };
    }

    const sharings = await prisma.sharingReservation.findMany({
      where: query,
      include: {
        sharing: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const safeSharingReservations = sharings.map((sharing) => ({
      ...sharing,
      createdAt: sharing.createdAt.toISOString(),
      startDate: sharing.startDate.toISOString(),
      endDate: sharing.endDate.toISOString(),
      listing: {
        ...sharing.sharing,
        createdAt: sharing.sharing.createdAt.toISOString(),
      },
    }));
    return safeSharingReservations;
  } catch (error: any) {
    throw new Error(error);
  }
}
