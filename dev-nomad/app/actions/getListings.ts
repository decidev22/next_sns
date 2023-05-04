import prisma from "@/app/libs/prismadb";
import { start } from "repl";

export interface IListingsParams {
  userId?: string;
  devCount?: number;
  roomCount?: number;
  tableCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      devCount,
      roomCount,
      tableCount,
      startDate,
      endDate,
      locationValue,
      category,
    } = params;
    let query: any = {};
    if (userId) {
      query.userId = userId;
    }
    if (category) {
      query.category = category;
    }
    if (devCount) {
      query.devCount = {
        gte: +devCount,
      };
    }
    if (roomCount) {
      query.roomCount = {
        gte: +roomCount,
      };
    }
    if (tableCount) {
      query.tableCount = {
        gte: +tableCount,
      };
    }
    if (locationValue) {
      query.locationValue = locationValue;
    }

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });
    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));
    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
