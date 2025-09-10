import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button, Card, Modal, ModalBody, ModalHeader } from "flowbite-react";
import ReactEcharts from "echarts-for-react";
import DatePicker from "react-datepicker";
import React from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

export default function Trending() {
    console.log(window.location.href.split("/").filter(Boolean)[2], "Trending");
    const [openModal, setOpenModal] = React.useState(false);
    const [selectedDateTime, setSelectedDateTime] = React.useState(new Date());
    const [selectedEndDateTime, setSelectedEndDateTime] = React.useState(
        new Date()
    );
    const [processing, setProcessing] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    const optionsTrending = {
        // title: {
        //     text: "Distribution of Electricity",
        // },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "cross",
            },
        },
        toolbox: {
            show: false,
            feature: {
                saveAsImage: {},
            },
        },
        axisLabel: {
            fontSize: 30,
            color: "#000", // warna teks
            fontWeight: "bold", // tebal
            rotate: 45, // rotasi jika label terlalu padat
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
            axisLabel: {
                fontSize: 20, // ✅ ukuran font sumbu X diatur di sini
            },
            // prettier-ignore
            data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45'],
        },
        yAxis: {
            type: "value",
            axisLabel: {
                formatter: "{value} W",
                fontSize: 20, // ⬅️ Ukuran font Y Axis
            },
            axisPointer: {
                snap: true,
            },
        },
        series: [
            {
                name: "Electricity",
                type: "line",
                smooth: true,
                lineStyle: {
                    color: "green",
                },
                itemStyle: {
                    color: "green",
                },
                // prettier-ignore
                data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400],
                markArea: {
                    itemStyle: {
                        color: "rgba(255, 173, 177, 0.4)",
                    },
                },
            },
        ],
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Trending
                </h2>
            }
        >
            <Head title="Trending" />

            <div>
                <div className="mx-auto max-w-8xl sm:px-6 lg:px-8">
                    <div className="p-2 text-white text-3xl ">Trending</div>
                    <div className="text-right mt-1">
                        <div
                            className="p-3 buttonwrapper text-white text-md text-right"
                            style={{ cursor: "pointer" }}
                            onClick={() => setOpenModal(true)}
                        >
                            {new Date().toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    </div>
                    <div className="mt-3 flex flex-col sm:flex-row">
                        <Card
                            className="w-full [&>div]:gap-1"
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                borderColor: "transparent",
                            }}
                        >
                            <span className="xl:text-2xl text-xl text-black font-semibold">
                                Data Daya (19:30:00 - 20:30:00)
                            </span>
                            <span className="text-gray-500">
                                (<b>Energy Produced:</b> 1.2 kWh)
                            </span>
                            <ReactEcharts
                                option={optionsTrending}
                                style={{
                                    height: "380px",
                                    width: "100%",
                                    position: "relative",
                                }}
                            />
                        </Card>
                    </div>
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
                                        style={{ display: "unset !important" }}
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
                                        style={{ display: "unset !important" }}
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
        </AuthenticatedLayout>
    );
}
