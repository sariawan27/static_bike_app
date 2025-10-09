import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Select,
    Tooltip,
} from "flowbite-react";
import ReactEcharts from "echarts-for-react";
import DatePicker from "react-datepicker";
import React from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import moment from "moment-timezone";

export default function Trending({ trxData, hrcData, filter }) {
    console.log(trxData);
    console.log(window.location.href.split("/").filter(Boolean)[2], "Trending");
    const { get } = useForm();
    const [openModal, setOpenModal] = React.useState(false);
    const [selectedHrc, setSelectedHrc] = React.useState(filter || "");

    const handleSearch = () => {
        setOpenModal(false);

        if (!selectedHrc) return;

        router.get(
            route("trending.index"), // pastikan route name sesuai
            { hrc_id: selectedHrc }, // 👈 param terkirim sebagai query string
            { preserveState: true, replace: true }
        );
    };
    const [selectedDateTime, setSelectedDateTime] = React.useState(new Date());
    const [selectedEndDateTime, setSelectedEndDateTime] = React.useState(
        new Date()
    );
    const [processing, setProcessing] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    let timestamp = trxData.map((trx) =>
        moment(trx.created_at).tz("Asia/Jakarta").format("HH:mm:ss")
    );
    let powerArray = trxData.map((trx) => trx.power);
    let totalEnergy = trxData.reduce(
        (sum, item) => sum + Number(item.energy),
        0
    );
    console.log(hrcData, "HRC DATA");
    console.log(selectedHrc, "SELECTED HRC");
    let hrcFilteredData = hrcData.find((item) => item.id === +filter);

    // 👉 [2200, 2760, 3600]

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
            data: timestamp,
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
                name: "Daya (W)",
                type: "line",
                smooth: true,
                lineStyle: {
                    color: "green",
                },
                itemStyle: {
                    color: "green",
                },
                // prettier-ignore
                data: powerArray,
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
                    <div className="text-right mt-1 button-container">
                        <div
                            className="p-3 text-white text-md text-right its"
                            // style={{ cursor: "pointer" }}
                            // onClick={() => setOpenModal(true)}
                        >
                            {new Date().toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>

                        <Tooltip content="Filter" placement="bottom">
                            <div
                                className="p-3 text-white text-md text-right its"
                                // style={{ cursor: "pointer" }}
                                onClick={() => setOpenModal(true)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                                    />
                                </svg>
                            </div>
                        </Tooltip>
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
                                Data Daya (
                                {selectedHrc == ""
                                    ? moment(hrcData[0]?.start)
                                          .tz("Asia/Jakarta")
                                          .format("DD MMMM yyyy HH:mm:ss")
                                    : moment(hrcFilteredData?.start)
                                          .tz("Asia/Jakarta")
                                          .format("DD MMMM yyyy HH:mm:ss")}{" "}
                                {selectedHrc == "" ? "" : " - "}
                                {selectedHrc == ""
                                    ? moment(hrcData[0]?.end)
                                          .tz("Asia/Jakarta")
                                          .format("DD MMMM yyyy HH:mm:ss")
                                    : moment(hrcFilteredData?.end)
                                          .tz("Asia/Jakarta")
                                          .format("DD MMMM yyyy HH:mm:ss")}
                                )
                            </span>
                            <span className="text-gray-500">
                                (<b>Energy Produced:</b>{" "}
                                {totalEnergy.toFixed(4)} J)
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
                    size="3xl"
                    popup
                    position="top-center"
                    onClose={() => setOpenModal(false)}
                >
                    <ModalHeader />
                    <ModalBody>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                Filter Rekam Data
                            </h3>
                            <div>
                                <Label htmlFor="hrcFilter" value="Pilih HRC" />
                                <Select
                                    id="hrcFilter"
                                    value={selectedHrc}
                                    onChange={(e) =>
                                        setSelectedHrc(e.target.value)
                                    }
                                >
                                    {/* <option value="">-- Semua HRC --</option> */}
                                    {hrcData.map((hrc) => (
                                        <option key={hrc.id} value={hrc.id}>
                                            {moment(hrc.start)
                                                .tz("Asia/Jakarta")
                                                .format(
                                                    "DD-MM-yyyy HH:mm:ss"
                                                )}{" "}
                                            -{" "}
                                            {moment(hrc.end)
                                                .tz("Asia/Jakarta")
                                                .format("DD-MM-yyyy HH:mm:ss")}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    style={{ backgroundColor: "#181745" }}
                                    onClick={handleSearch}
                                >
                                    Search Data
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
