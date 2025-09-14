import Link from "next/link";
import Logo from "../LogoWhite";
import SocialMedia from "../SocialMedia";
import { quickLinksData } from "@/constants";
import { Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black border-t">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Newsletter + Brand */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <p className="text-gray-100 text-sm mb-4">
                Sign up to our newsletter to receive exclusive offers.
              </p>
              <form className="flex flex-col  gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-2  border border-gray-600 bg-transparent text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                <button
                  type="submit"
                  className="px-5 py-2 w-1/2 bg-gray-200 text-gray-800 font-medium  hover:bg-gray-100 transition-colors"
                >
                  SUBSCRIBE
                </button>
              </form>
            </div>
            <Logo className="w-40" />
          </div>

          {/* Quick Links */}
          <div className="flex flex-col sm:ml-10">
            <h3 className="font-medium text-white mb-4">COMPANY</h3>
            <ul className="space-y-3 mb-6">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href}
                    className="text-gray-300 hover:text-white text-sm font-normal transition-colors"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
            <SocialMedia
              className="text-white"
              iconClassName="border-black hover:font-bold hover:text-white transition-colors"
              tooltipClassName="bg-gray-800 text-white"
            />
          </div>

          {/* Reach Us */}
          <div>
            <h3 className="font-medium text-white mb-4">REACH US</h3>
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-gray-300 text-sm">
                <FaWhatsapp className="w-5 h-5   text-white" />
                {/* <MessageCircle className="w-4 h-4 text-white" /> */}
                <a
                  href="https://wa.me/+947775507540"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +974 775 507 540
                </a>
              </p>
              <p className="flex items-center gap-2 text-gray-300 text-sm">
                <Mail className="w-5 h-5 text-white" />
                <a
                  href="mailto:elvynstoreofficial@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  elvynstoreofficial@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="py-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-gray-100 font-semibold tracking-wide uppercase hover:text-white transition-colors">
              Elvyn
            </span>{" "}
            . All rights reserved.
          </p>
          <p className="mt-1 text-xs">
            Developed by{" "}
            <span className="font-semibold text-white hover:text-gray-400 transition-colors">
              Ahamed Web Studio
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
