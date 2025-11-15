// src/components/NavbarSidebarLayout.jsx
import {
    Button,
    ChevronUpIcon,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    Modal,
    ModalBody,
    ModalHeader,
    TextInput,
} from "flowbite-react";
import React from "react";

import { HiCheckCircle, HiLogout, HiOutlineCog, HiUser } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";
import InputLabel from "./InputLabel";
import InputError from "./InputError";
import { useForm } from "@inertiajs/react";

const NavbarSidebarLayout = ({ header, children, user }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        rpmIddleTime: 0,
    });

    // Tutup sidebar saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                !event.target.closest("button[data-toggle-sidebar]")
            ) {
                setIsSidebarOpen(false);
            }
        };

        if (isSidebarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen]);

    return (
        <div className="min-h-screen " id="content-body">
            <button
                data-drawer-target="separator-sidebar"
                data-drawer-toggle="separator-sidebar"
                aria-controls="separator-sidebar"
                type="button"
                className="inline-flex items-center p-2 mt-2 ms-3 text-sm rounded-lg hd:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 focus:text-black"
                onClick={toggleSidebar}
            >
                <span className="sr-only">Open sidebar</span>
                <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    />
                </svg>
            </button>

            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                id="separator-sidebar"
                className={`fixed top-0 left-0 z-50 w-64 h-screen transition-transform
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    hd:translate-x-0
                `}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 pb-4 overflow-y-auto" id="nav">
                    <a
                        href="/dashboard"
                        className="flex items-center ps-2.5 mb-5 text-white"
                    >
                        <img
                            src="https://dev-app.chimney.id/central-app/static/media/Logo%20S2P%20Emas.08f61290.png"
                            className="h-6 me-3 sm:h-7"
                            alt="Flowbite Logo"
                        />
                        <span className="self-center text-xl font-semibold whitespace-nowrap">
                            Static Bike
                        </span>
                    </a>
                    <ul className="space-y-2 font-medium">
                        {[
                            {
                                name: "Dashboard",
                                link: "/dashboard",
                                icon: (
                                    <svg
                                        className="w-6 h-6  hover:text-black"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                name: "Trending",
                                link: "/trending",
                                badge: "3",
                                icon: (
                                    <svg
                                        className="w-6 h-6  hover:text-black"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 4.5V19a1 1 0 0 0 1 1h15M7 14l4-4 4 4 5-5m0 0h-3.207M20 9v3.207"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                name: "Reporting",
                                link: "/reporting",
                                icon: (
                                    <svg
                                        className="w-6 h-6 hover:text-black"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 3v4a1 1 0 0 1-1 1H5m4 10v-2m3 2v-6m3 6v-3m4-11v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                                        />
                                    </svg>
                                ),
                            },
                        ].map((item) => (
                            <li key={item.name} className=" hover:text-black">
                                <a
                                    href={item.link}
                                    className={`flex items-center p-2 hover:text-black  hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                                        (item.link === "/dashboard" &&
                                            window.location.href
                                                .split("/")
                                                .filter(Boolean)[2] ===
                                                "dashboard") ||
                                        (item.link === "/trending" &&
                                            window.location.href
                                                .split("/")
                                                .filter(Boolean)[2] ===
                                                "trending") ||
                                        (item.link === "/reporting" &&
                                            window.location.pathname.split(
                                                "/"
                                            )[1] === "reporting")
                                            ? "bg-gray-100 text-black"
                                            : ""
                                    }`}
                                >
                                    <span
                                        className={`w-5 h-5 hover:text-black dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white ${
                                            (item.link === "/dashboard" &&
                                                window.location.href
                                                    .split("/")
                                                    .filter(Boolean)[2] ===
                                                    "dashboard") ||
                                            (item.link === "/trending" &&
                                                window.location.href
                                                    .split("/")
                                                    .filter(Boolean)[2] ===
                                                    "trending") ||
                                            (item.link === "/reporting" &&
                                                window.location.pathname.split(
                                                    "/"
                                                )[1] === "reporting")
                                                ? "bg-gray-100 text-black"
                                                : "text-white"
                                        }`}
                                    >
                                        {item.icon}
                                    </span>
                                    <span className="flex-1 ms-3 whitespace-nowrap hover:text-black">
                                        {item.name}
                                    </span>
                                    {item.badge && (
                                        <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                            {item.badge}
                                        </span>
                                    )}
                                </a>
                            </li>
                        ))}
                    </ul>
                    {user?.role === 1 ? (
                        <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700 flex flex-col flex-1">
                            <li className=" hover:text-black">
                                <a
                                    href={route("users.index")}
                                    className={`flex items-center p-2 hover:text-black  hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                                        window.location.href
                                            .split("/")
                                            .filter(Boolean)[2] === "users"
                                            ? "bg-gray-100 text-black"
                                            : ""
                                    }`}
                                >
                                    <span
                                        className={`w-5 h-5 hover:text-black dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white  ${
                                            window.location.href
                                                .split("/")
                                                .filter(Boolean)[2] === "users"
                                                ? "bg-gray-100 text-black"
                                                : "text-white"
                                        }`}
                                    >
                                        <svg
                                            className="w-6 h-6 hover:text-black"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeWidth="2"
                                                d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                            />
                                        </svg>
                                    </span>
                                    <span className="flex-1 ms-3 whitespace-nowrap hover:text-black">
                                        Users
                                    </span>
                                </a>
                            </li>
                        </ul>
                    ) : null}

                    <ul
                        className="space-y-2 font-medium absolute bottom-2"
                        style={{ width: "85%" }}
                    >
                        <li id="profile-dropdown">
                            <Dropdown
                                label=""
                                dismissOnClick={false}
                                renderTrigger={() => (
                                    <a
                                        href="#"
                                        className="flex items-center p-2 hover:text-black  hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                    >
                                        <img
                                            src="https://catalyst-demo.tailwindui.com/users/erica.jpg"
                                            className="h-6 me-3 sm:h-7"
                                            alt="Flowbite Logo"
                                        />
                                        <span className="flex-1 ms-3 whitespace-nowrap">
                                            {user?.name}
                                        </span>
                                        <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium">
                                            <ChevronUpIcon />
                                        </span>
                                    </a>
                                )}
                                placement="top"
                            >
                                <DropdownHeader>
                                    <span className="block text-sm">
                                        {user?.name}
                                    </span>
                                    <span className="block truncate text-sm font-medium">
                                        {user?.username}
                                    </span>
                                </DropdownHeader>
                                <DropdownItem
                                    icon={HiUser}
                                    href={route("profile.edit")}
                                >
                                    Profile
                                </DropdownItem>
                                {user?.role === 1 ? (
                                    <DropdownItem
                                        icon={HiOutlineCog}
                                        onClick={() => setOpenModal(true)}
                                    >
                                        Settings
                                    </DropdownItem>
                                ) : null}
                                <DropdownDivider />
                                <DropdownItem
                                    icon={HiLogout}
                                    href={route("logout")}
                                    method="post"
                                >
                                    Sign out
                                </DropdownItem>
                            </Dropdown>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={`p-4 transition-all duration-300 
                    hd:ml-64
                `}
            >
                <div className="p-4">{children}</div>
                <Modal
                    show={openModal}
                    size="md"
                    popup
                    position="top-center"
                    onClose={() => setOpenModal(false)}
                >
                    <ModalHeader />
                    <ModalBody>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                Settings
                            </h3>
                            <form>
                                <div>
                                    <InputLabel
                                        htmlFor="rpmIddleTime"
                                        value="Minimum RPM Iddle Time"
                                    />

                                    <TextInput
                                        type="number"
                                        id="rpmIddleTime"
                                        name="rpmIddleTime"
                                        value={data.rpmIddleTime}
                                        className="mt-1 block w-full text-right"
                                        position="right"
                                        autoComplete="rpmIddleTime"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData(
                                                "rpmIddleTime",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.rpmIddleTime}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="w-full flex justify-end mt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        style={{
                                            backgroundColor: "#181745",
                                        }}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        </div>
    );
};

// Komponen Kartu Placeholder
const CardBox = ({ large }) => {
    return (
        <div
            className={`flex items-center justify-center ${
                large ? "h-48" : "h-28"
            } rounded-sm bg-gray-50 dark:bg-gray-800`}
        >
            <svg
                className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 18 18"
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 1v16M1 9h16"
                />
            </svg>
        </div>
    );
};

export default NavbarSidebarLayout;
