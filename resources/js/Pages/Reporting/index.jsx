import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Button,
    Card,
    Modal,
    ModalBody,
    ModalHeader,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
} from "flowbite-react";
import React, { useState } from "react";
import DatePicker from "react-datepicker";

export default function Reporting({ trxData, filters }) {
    const [openModal, setOpenModal] = useState(false);
    const [openFilterModal, setOpenFilterModal] = useState(false);

    const [selectedDateTime, setSelectedDateTime] = React.useState(new Date());
    const [selectedEndDateTime, setSelectedEndDateTime] = React.useState(
        new Date()
    );
    const [processing, setProcessing] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    const [loading, setLoading] = useState(false);

    const handlePageChange = (url) => {
        if (!url) return;
        setLoading(true);
        router.get(
            url,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    console.log(
        window.location.href.split("/").filter(Boolean)[2],
        "Reporting"
    );
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Reporting
                </h2>
            }
        >
            <Head title="Reporting" />

            <div>
                <div className="mx-auto max-w-8xl sm:px-6 lg:px-8">
                    <div className="p-2 text-white text-3xl ">Reporting</div>
                    <div className="text-right mt-1">
                        <div
                            className="p-3 buttonwrapper text-white text-md text-right"
                            style={{ cursor: "pointer" }}
                            onClick={() => setOpenFilterModal(true)}
                        >
                            {new Date().toLocaleDateString("id-ID", {
                                timeZone: "Asia/Jakarta",
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
                                        onClick={() => setOpenModal(true)}
                                        pill
                                    >
                                        Export
                                    </Button>
                                </div>
                                <div className="overflow-x-auto">
                                    <Table hoverable>
                                        <TableHead>
                                            <TableRow>
                                                <TableHeadCell className="text-center">
                                                    No.
                                                </TableHeadCell>
                                                <TableHeadCell>
                                                    Record Date Time
                                                </TableHeadCell>
                                                <TableHeadCell>
                                                    Voltage
                                                </TableHeadCell>
                                                <TableHeadCell className="text-center">
                                                    Current
                                                </TableHeadCell>
                                                <TableHeadCell className="text-center">
                                                    Daya
                                                </TableHeadCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className="divide-y">
                                            {loading ? (
                                                <TableRow
                                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                                    style={{
                                                        backgroundColor:
                                                            "rgba(255, 255, 255, 0.9)",
                                                    }}
                                                >
                                                    <TableCell
                                                        colSpan={5}
                                                        className="text-center py-6 text-gray-500"
                                                    >
                                                        <Spinner size="lg" />
                                                    </TableCell>
                                                </TableRow>
                                            ) : trxData.data.length > 0 ? (
                                                trxData.data.map(
                                                    (item, index) => (
                                                        <TableRow
                                                            key={item.id}
                                                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                                            style={{
                                                                backgroundColor:
                                                                    "rgba(255, 255, 255, 0.9)",
                                                            }}
                                                        >
                                                            <TableCell className="text-center text-gray-900 dark:text-white">
                                                                {(trxData.current_page -
                                                                    1) *
                                                                    trxData.per_page +
                                                                    index +
                                                                    1}
                                                            </TableCell>
                                                            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                {
                                                                    item.created_at
                                                                }
                                                            </TableCell>
                                                            <TableCell className="text-gray-900 dark:text-white">
                                                                {item.voltage} V
                                                            </TableCell>
                                                            <TableCell className="text-center text-gray-900 dark:text-white">
                                                                {item.current} A
                                                            </TableCell>
                                                            <TableCell className="text-center text-gray-900 dark:text-white">
                                                                {item.power} W
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )
                                            ) : (
                                                <TableRow
                                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                                    style={{
                                                        backgroundColor:
                                                            "rgba(255, 255, 255, 0.9)",
                                                    }}
                                                >
                                                    <TableCell
                                                        colSpan={5}
                                                        className="text-center py-4 text-gray-500"
                                                    >
                                                        Data tidak tersedia
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                    {console.log(trxData.links)}

                                    {/* Pagination */}
                                    <div className="flex justify-center items-center gap-2 mt-4">
                                        {trxData.links.map((link, i) => (
                                            <button
                                                key={i}
                                                disabled={!link.url || loading}
                                                onClick={() =>
                                                    handlePageChange(link.url)
                                                }
                                                className={`px-3 py-1 rounded ${
                                                    link.active
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                } ${
                                                    !link.url
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Modal
                        show={openModal}
                        size="md"
                        onClose={() => setOpenModal(false)}
                        popup
                        position="top-center"
                    >
                        <ModalHeader />
                        <ModalBody>
                            <div className="text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Pilih format ekspor data yang diinginkan!
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        color="default"
                                        onClick={() => setOpenModal(false)}
                                    >
                                        Pdf
                                    </Button>
                                    <Button
                                        color="green"
                                        onClick={() => setOpenModal(false)}
                                    >
                                        Excel
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                    <Modal
                        show={openFilterModal}
                        size="md"
                        popup
                        position="top-center"
                        onClose={() => setOpenFilterModal(false)}
                    >
                        <ModalHeader />
                        <ModalBody>
                            <div className="space-y-6">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                    Filter Date&Time
                                </h3>
                                <form>
                                    <div>
                                        <InputLabel
                                            htmlFor="startDate"
                                            value="Start Date"
                                        />

                                        <DatePicker
                                            id="startDate"
                                            className="w-full"
                                            style={{
                                                display: "unset !important",
                                            }}
                                            selected={selectedDateTime}
                                            onChange={(date) =>
                                                setSelectedDateTime(date)
                                            }
                                            showTimeSelect
                                            timeFormat="HH:mm:ss"
                                            dateFormat="MMMM d, yyyy h:mm:ss aa"
                                        />

                                        <InputError
                                            message={errors.startDate}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <InputLabel
                                            htmlFor="endDate"
                                            value="End Date"
                                        />

                                        <DatePicker
                                            id="endDate"
                                            className="w-full"
                                            style={{
                                                display: "unset !important",
                                            }}
                                            selected={selectedEndDateTime}
                                            onChange={(date) =>
                                                setSelectedEndDateTime(date)
                                            }
                                            showTimeSelect
                                            timeFormat="HH:mm:ss"
                                            dateFormat="MMMM d, yyyy h:mm:ss aa"
                                        />

                                        <InputError
                                            message={errors.endDate}
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
                                            Search Data
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
