import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && path !== "/admin/login") {
      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      const editorOnlyPaths = ["/admin/settings", "/admin/users"];
      if (
        editorOnlyPaths.some((p) => path.startsWith(p)) &&
        token.role === "editor"
      ) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname === "/admin/login") return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
