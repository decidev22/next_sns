import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export default async function getSharingById(params: IParams) {
  try {
    const { listingId } = params;

    // Check if listingId is a valid value
    if (!listingId) {
      return null;
    }
    // const allListings = await prisma.sharing.findMany();
    // console.log(allListings);

    const sharing = await prisma.sharing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true,
      },
    });

    if (!sharing) {
      return null;
    }

    return {
      ...sharing,
      createdAt: sharing.createdAt.toISOString(),
      user: {
        ...sharing.user,
        createdAt: sharing.user.createdAt!.toISOString(),
        updatedAt: sharing.user.updatedAt!.toISOString(),
        emailVerified:
          sharing.user.emailVerified?.toISOString() || null,
      },
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
