import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
    Button,
    Card,
    Dropdown,
    DropdownItem,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    TextInput,
} from "flowbite-react";
import { useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";

export default function ListPage() {
    console.log(
        window.location.href.split("/").filter(Boolean)[2],
        "Dashboard"
    );

    const user = usePage().props.users;
    console.log("User:", user);

    const [openModal, setOpenModal] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        mode: "create", // create or edit
        id: "",
        name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        console.log("Submitting data:", data.mode);
        if (data.mode === "edit") {
            if (!data.id) {
                console.error("ID kosong! Tidak bisa update.");
                return;
            }
            put(route("users.update", data.id), {
                preserveScroll: true,
                name: data.name,
                username: data.username,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
                onFinish: () => {
                    reset("password", "password_confirmation");
                    console.log("User updated");
                },
            });
            // post(route("users.update", data?.id), {
            //     onFinish: () => reset("password", "password_confirmation"),
            // });
            // return;
        } else {
            post(route("users.store"), {
                onFinish: () => reset("password", "password_confirmation"),
            });
        }
    };

    const deleteUser = (id) => {
        if (confirm("Are you sure?")) {
            router.delete(route("users.destroy", id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Users
                </h2>
            }
        >
            <Head title="Users" />

            <div>
                <div className="mx-auto max-w-8xl sm:px-6 lg:px-8">
                    <div className="p-2 text-white text-3xl ">Users</div>
                    <div className="text-right mt-1">
                        <div className="p-3 buttonwrapper text-white text-md text-right">
                            {new Date().toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                        <Card
                            className="w-full"
                            style={{
                                backgroundColor: "rgba(24, 22, 70, 0.8)",
                                borderColor: "transparent",
                                color: "white",
                            }}
                        >
                            <div className="mt-1 flex flex-col gap-3">
                                <div className="flex justify-end items-center mr-2">
                                    <Button
                                        color="light"
                                        className="w-20"
                                        pill
                                        onClick={() => {
                                            setData("mode", "create");
                                            setData("role", "");
                                            setData("id", "");
                                            setData("name", "");
                                            setData("username", "");
                                            setData("email", "");
                                            setOpenModal(true);
                                        }}
                                    >
                                        Add
                                    </Button>
                                </div>
                                <div>
                                    <Table hoverable>
                                        <TableHead>
                                            <TableRow>
                                                <TableHeadCell>
                                                    Name
                                                </TableHeadCell>
                                                <TableHeadCell>
                                                    Email
                                                </TableHeadCell>
                                                <TableHeadCell className="text-center">
                                                    Role
                                                </TableHeadCell>
                                                <TableHeadCell className="text-center">
                                                    Action
                                                </TableHeadCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className="divide-y">
                                            {user.map((user) => (
                                                <TableRow
                                                    key={user.id}
                                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                                    style={{
                                                        backgroundColor:
                                                            "rgba(255, 255, 255, 0.9)",
                                                    }}
                                                >
                                                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                        {user?.name}
                                                    </TableCell>
                                                    <TableCell className="text-gray-900 dark:text-white">
                                                        {user?.email}
                                                    </TableCell>
                                                    <TableCell className="text-center text-gray-900 dark:text-white">
                                                        {user?.role === 1
                                                            ? "Admin"
                                                            : "User"}
                                                    </TableCell>
                                                    <TableCell className="text-center text-gray-900 dark:text-white">
                                                        <Dropdown
                                                            label=""
                                                            className="opacity-100 disabled:opacity-75 z-10"
                                                            dismissOnClick={
                                                                false
                                                            }
                                                            renderTrigger={() => (
                                                                <a
                                                                    href="#"
                                                                    className="font-medium hover:underline flex justify-center"
                                                                >
                                                                    <HiOutlineDotsVertical
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-center"
                                                                    />
                                                                </a>
                                                            )}
                                                            placement="bottom"
                                                        >
                                                            <DropdownItem
                                                                className="opacity-100 disabled:opacity-75"
                                                                onClick={() => {
                                                                    setData(
                                                                        "mode",
                                                                        "edit"
                                                                    );
                                                                    setData(
                                                                        "role",
                                                                        user.role
                                                                    );
                                                                    setData(
                                                                        "id",
                                                                        user.id
                                                                    );
                                                                    setData(
                                                                        "name",
                                                                        user.name
                                                                    );
                                                                    setData(
                                                                        "username",
                                                                        user.username
                                                                    );
                                                                    setData(
                                                                        "email",
                                                                        user.email
                                                                    );
                                                                    setOpenModal(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                Edit
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                className="text-red-600 opacity-100 disabled:opacity-75"
                                                                onClick={() =>
                                                                    deleteUser(
                                                                        user.id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </DropdownItem>
                                                        </Dropdown>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </Card>
                    </div>

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
                                    {data?.mode == "create"
                                        ? "Registration User"
                                        : "Edit User"}
                                </h3>
                                <form onSubmit={submit}>
                                    <div>
                                        <InputLabel
                                            htmlFor="name"
                                            value="Name"
                                        />

                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            autoComplete="name"
                                            isFocused={true}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            required
                                        />

                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <InputLabel
                                            htmlFor="username"
                                            value="Username"
                                        />

                                        <TextInput
                                            id="username"
                                            type="text"
                                            name="username"
                                            value={data.username}
                                            className="mt-1 block w-full"
                                            autoComplete="username"
                                            onChange={(e) =>
                                                setData(
                                                    "username",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />

                                        <InputError
                                            message={errors.username}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <InputLabel
                                            htmlFor="email"
                                            value="Email"
                                        />

                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="mt-1 block w-full"
                                            autoComplete="username"
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            required
                                        />

                                        <InputError
                                            message={errors.email}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <InputLabel
                                            htmlFor="password"
                                            value="Password"
                                        />

                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <InputError
                                            message={errors.password}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <InputLabel
                                            htmlFor="password_confirmation"
                                            value="Confirm Password"
                                        />

                                        <TextInput
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
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
                                            {data?.mode == "create"
                                                ? "Register Now!"
                                                : "Update Now!"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
