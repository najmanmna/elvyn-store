"use client";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "../Container";
import { Fragment } from "react";

const LinkBadge = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  // For account routes, show the special account breadcrumb
  if (pathname.includes("/account/")) {
    const lastSegment = pathSegments[pathSegments.length - 1];

    return (
      <div className="bg-tech_white py-5">
        <Container className="flex items-center gap-2 text-sm">
          <Link
            href="/account/account"
            className="hover:text-tech_orange hoverEffect"
          >
            <Home size={17} />
          </Link>
          <span>/</span>
          <Link
            href={"/account/account"}
            className={`${lastSegment === "account" ? "text-tech_orange" : ""} hover:text-tech_orange hoverEffect`}
          >
            Account
          </Link>
          {lastSegment !== "account" && (
            <>
              <span>/</span>
              <span className="text-tech_orange capitalize">{lastSegment}</span>
            </>
          )}
        </Container>
      </div>
    );
  }

  // For all other routes, show a simple breadcrumb with home icon and route name
  if (pathSegments.length > 0) {
    return (
      <div className="bg-tech_white py-5">
        <Container className="flex items-center gap-2 text-sm">
          <Link href="/" className="hover:text-tech_orange hoverEffect">
            <Home size={17} />
          </Link>

          {pathSegments.map((segment, index) => (
            <Fragment key={index}>
              <span>/</span>
              {index === pathSegments.length - 1 ? (
                // Last segment (current page) - highlighted
                <span className="text-tech_orange capitalize">{segment}</span>
              ) : (
                // Previous segments - clickable links
                <Link
                  href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                  className="hover:text-tech_orange hoverEffect capitalize"
                >
                  {segment}
                </Link>
              )}
            </Fragment>
          ))}
        </Container>
      </div>
    );
  }

  // For home page, don't show anything
  return null;
};

export default LinkBadge;
