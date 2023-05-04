export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/journey", "/reservations", "/properties", "/favorites"],
};
