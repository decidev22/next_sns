"use client";
import Container from "../conainter";
import { TbBeach, TbBrandOffice } from "react-icons/tb";
import {
  GiModernCity,
  GiMountaintop,
  GiHills,
  GiIsland,
} from "react-icons/Gi";
import { BsHouses } from "react-icons/Bs";
import { IoCafeOutline, IoDiamond } from "react-icons/io5";
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";

export const categories = [
  {
    label: "Rural",
    icon: GiHills,
    description: "This nomad is a rural area!",
  },
  {
    label: "Beach",
    icon: TbBeach,
    description: "This nomad is close to the beach!",
  },
  {
    label: "Island",
    icon: GiIsland,
    description: "This nomad is on an island!",
  },
  {
    label: "Mountain",
    icon: GiMountaintop,
    description: "This nomad is close to the montains!",
  },
  {
    label: "Urban",
    icon: GiModernCity,
    description: "This nomad is close to the urban!",
  },

  {
    label: "Office",
    icon: TbBrandOffice,
    description: "This nomad is in an office space!",
  },
  {
    label: "Lux",
    icon: IoDiamond,
    description: "This nomad is in a luxurious place!",
  },
  {
    label: "GuestHouse",
    icon: BsHouses,
    description: "This nomad is in a guest house property!",
  },
  {
    label: "Cafe",
    icon: IoCafeOutline,
    description: "This nomad is a cafe!",
  },
];

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathName = usePathname();

  const isMainPage = pathName === "/";
  if (!isMainPage) {
    return null;
  }
  return (
    <Container>
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            selected={category === item.label}
            icon={item.icon}
          ></CategoryBox>
        ))}
      </div>
    </Container>
  );
};

export default Categories;
