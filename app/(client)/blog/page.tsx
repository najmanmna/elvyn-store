import Container from "@/components/Container";
import Title from "@/components/Title";
import { urlFor } from "@/sanity/lib/image";
import { getAllBlogs } from "@/sanity/queries";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogPage = async () => {
  const blogs = await getAllBlogs(6);

  return (
    <div className="py-10 bg-tech_white">
      <Container>
        <Title>Our Blogs</Title>
        <p className="text-sm text-tech_dark/80 tracking-wide mt-1 leading-5 max-w-3xl">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam,
          error molestiae. Voluptatibus est tempore illum perferendis doloribus
          corrupti dolores rerum reiciendis animi? Quam, quis minus tempore amet
          totam cum atque eum deserunt nobis iste voluptate.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 md:mt-10">
          {blogs?.map((blog) => (
            <div
              key={blog?._id}
              className="rounded-md overflow-hidden relative group"
            >
              <div className="w-full max-h-96 overflow-hidden">
                {blog?.mainImage && (
                  <Image
                    src={urlFor(blog?.mainImage).url()}
                    alt="blogImage"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-110 hoverEffect"
                  />
                )}
              </div>
              <Link
                href={`/blog/${blog?.slug?.current}`}
                className="absolute inset-1"
              ></Link>
              <div className="bg-tech_bg_color p-5">
                <div className="text-xs flex items-center gap-5">
                  <div className="flex items-center relative group cursor-pointer">
                    {blog?.blogcategories?.map((item, index) => (
                      <p
                        key={index}
                        className="font-semibold text-tech_orange tracking-wider"
                      >
                        {item?.title}
                      </p>
                    ))}
                    <span className="absolute left-0 -bottom-1.5 bg-tech_light_color/30 inline-block w-full h-[2px] group-hover:bg-tech_orange hover:cursor-pointer hoverEffect" />
                  </div>
                  <p className="flex items-center gap-1 text-tech_light_color relative group hover:cursor-pointer hover:text-tech_orange hoverEffect">
                    <Calendar size={15} />{" "}
                    {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
                    <span className="absolute left-0 -bottom-1.5 bg-tech_light_color/30 inline-block w-full h-[2px] group-hover:bg-tech_orange hoverEffect" />
                  </p>
                </div>
                <Link
                  href={`/blog/${blog?.slug?.current}`}
                  className="text-base font-bold tracking-wide mt-5 line-clamp-2 h-12 group-hover:text-tech_orange hoverEffect"
                >
                  {blog?.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default BlogPage;
