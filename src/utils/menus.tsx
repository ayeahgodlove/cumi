// icons
import { MdBrowseGallery } from "react-icons/md";
import { FcEditImage } from "react-icons/fc";
import { GrBlog, GrDashboard, GrServices } from "react-icons/gr";
import { FaCircleQuestion, FaFireExtinguisher } from "react-icons/fa6";
import { TbCategoryPlus } from "react-icons/tb";

import { FiBook, FiGlobe, FiPaperclip, FiTag } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { IoSchoolOutline } from "react-icons/io5";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { SlEvent } from "react-icons/sl";

export const useMenu = () => {
  const t = useTranslations("menus");

  const menus = [
    {
      name: "dashboard",
      list: "/dashboard",
      icon: <GrDashboard />,
      meta: {
        canAccess: ["admin"],
        label: "Dashoard",
      },
    },
    {
      name: "posts",
      list: "/dashboard/blog-posts",
      create: "/dashboard/blog-posts/create",
      edit: "/dashboard/blog-posts/edit/:id",
      show: "/dashboard/blog-posts/show/:id",
      meta: {
        canAccess: ["admin"],
        label: "Posts",
      },
      icon: <GrBlog />,
    },
    {
      name: "settings",
      meta: {
        canAccess: ["admin"],
        label: "Settings",
      },
    },
    {
      name: "categories",
      list: "/dashboard/categories",
      create: "/dashboard/categories/create",
      edit: "/dashboard/categories/edit/:id",
      show: "/dashboard/categories/show/:id",
      icon: <TbCategoryPlus />,
      parentName: "settings",
      meta: {
        canAccess: ["admin"],
        label: "Categories",
        parent: "settings",
      },
    },
    {
      name: "tags",
      list: "/dashboard/tags",
      create: "/dashboard/tags/create",
      edit: "/dashboard/tags/edit/:id",
      show: "/dashboard/tags/show/:id",
      parentName: "settings",
      meta: {
        canAccess: ["admin"],
        label: "Tags",
        parent: "settings",
      },
      icon: <FiTag />,
    },
    {
      name: "banners",
      list: "/dashboard/banners",
      create: "/dashboard/banners/create",
      edit: "/dashboard/banners/edit/:id",
      show: "/dashboard/banners/show/:id",
      parentName: "settings",
      meta: {
        canAccess: ["admin"],
        label: "Banners",
        parent: "settings",
      },
      icon: <FcEditImage />,
    },
    {
      name: "media",
      list: "/dashboard/media",
      create: "/dashboard/media/create",
      edit: "/dashboard/media/edit/:id",
      show: "/dashboard/media/show/:id",
      parentName: "settings",
      meta: {
        canAccess: ["admin"],
        label: "Media",
        parent: "settings",
      },
      icon: <MdBrowseGallery />,
    },
    {
      name: "events",
      list: "/dashboard/events",
      create: "/dashboard/events/create",
      edit: "/dashboard/events/edit/:id",
      show: "/dashboard/events/show/:id",
      meta: {
        canAccess: ["admin"],
        label: "Events",
      },
      icon: <SlEvent />,
    },
    {
      name: "services",
      list: "/dashboard/services",
      create: "/dashboard/services/create",
      edit: "/dashboard/services/edit/:id",
      show: "/dashboard/services/show/:id",
      meta: {
        canAccess: ["admin"],
        label: "Services",
      },
      icon: <GrServices />,
    },
    {
      name: "projects",
      list: "/dashboard/projects",
      create: "/dashboard/projects/create",
      edit: "/dashboard/projects/edit/:id",
      show: "/dashboard/projects/show/:id",
      meta: {
        canAccess: ["admin"],
        label: "Projects",
      },
      icon: <AiOutlineFundProjectionScreen />,
    },
    {
      name: "users",
      list: "/dashboard/users",
      create: "/dashboard/users/create",
      edit: "/dashboard/users/edit/:id",
      show: "/dashboard/users/show/:id",
      meta: {
        canAccess: ["admin"],
        label: "Users",
      },
      icon: <IoSchoolOutline />,
    },
    {
      name: "opportunities",
      list: "/dashboard/opportunities",
      create: "/dashboard/opportunities/create",
      edit: "/dashboard/opportunities/edit/:id",
      show: "/dashboard/opportunities/show/:id",
      meta: {
        canAccess: ["admin"],
        label: "Opportunities",
      },
      icon: <FiGlobe />,
    },
    {
      name: "LMS",
      meta: {
        canAccess: ["admin"],
        label: "LMS",
      },
    },
    {
      name: "courses",
      list: "/dashboard/courses",
      create: "/dashboard/courses/create",
      edit: "/dashboard/courses/edit/:id",
      show: "/dashboard/courses/show/:id",
      parentName: "lms",
      meta: {
        canAccess: ["admin"],
        label: "Courses",
        parent: "lms",
      },
      icon: <FiBook />,
    },
    {
      name: "lessons",
      list: "/dashboard/lessons",
      create: "/dashboard/lessons/create",
      edit: "/dashboard/lessons/edit/:id",
      show: "/dashboard/lessons/show/:id",
      parentName: "lms",
      meta: {
        canAccess: ["admin"],
        label: "Lessons",
        parent: "lms",
      },
      icon: <FiPaperclip />,
    },
    {
      name: "quizes",
      list: "/dashboard/quizes",
      create: "/dashboard/quizes/create",
      edit: "/dashboard/quizes/edit/:id",
      show: "/dashboard/quizes/show/:id",
      parentName: "lms",
      meta: {
        canAccess: ["admin"],
        label: "Quizes",
        parent: "lms",
      },
      icon: <FaCircleQuestion />,
    },
    {
      name: "enrollments",
      list: "/dashboard/enrollments",
      create: "/dashboard/enrollments/create",
      edit: "/dashboard/enrollments/edit/:id",
      show: "/dashboard/enrollments/show/:id",
      parentName: "lms",
      meta: {
        canAccess: ["admin"],
        label: "Enrollments",
        parent: "lms",
      },
      icon: <FaFireExtinguisher />,
    },
    {
      name: "professionals",
      list: "/dashboard/professionals",
      create: "/dashboard/professionals/create",
      edit: "/dashboard/professionals/edit/:id",
      show: "/dashboard/professionals/show/:id",
      parentName: "lms",
      meta: {
        canAccess: ["admin"],
        label: "professionals",
        parent: "lms",
      },
      icon: <FaFireExtinguisher />,
    },
    {
      name: "subscribe",
      list: "/dashboard/subscribe",
      create: "/dashboard/subscribe/create",
      edit: "/dashboard/subscribe/edit/:id",
      show: "/dashboard/subscribe/show/:id",
      parentName: "lms",
      meta: {
        canAccess: ["admin"],
        label: "subscribe",
        parent: "lms",
      },
      icon: <FaFireExtinguisher />,
    },
    {
      name: "contact-messages",
      list: "/dashboard/contact-messages",
      create: "/dashboard/contact-messages/create",
      edit: "/dashboard/contact-messages/edit/:id",
      show: "/dashboard/contact-messages/show/:id",
      parentName: "lms",
      meta: {
        canAccess: ["admin"],
        label: "contact-messages",
        parent: "lms",
      },
      icon: <FaFireExtinguisher />,
    },
  ];

  return { menus };
};
