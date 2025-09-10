import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Button, Card } from "flowbite-react";
import ReactEcharts from "echarts-for-react";
import { HiPause, HiPlay } from "react-icons/hi";
import Tour from "reactour";
import { useEffect, useRef, useState } from "react";

import { io } from "socket.io-client";

export default function Dashboard() {
    console.log(
        window.location.href.split("/").filter(Boolean)[2],
        "Dashboard"
    );

    const user = usePage().props.auth.user;

    const optionsRPM = {
        series: [
            {
                type: "gauge",
                startAngle: 180,
                radius: "65%",
                endAngle: 0,
                center: ["50%", "58%"],
                splitNumber: 10,
                itemStyle: {
                    color: "#41b8d5",
                    shadowColor: "rgba(0,138,255,0.45)",
                    shadowBlur: 10,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                },
                progress: {
                    width: 25,
                    show: true,
                    overlap: true,
                    roundCap: false,
                },
                axisLine: {
                    width: 25,
                    lineStyle: {
                        color: [[1, "#6ce5e8"]],
                        width: 25,
                    },
                    roundCap: false,
                },
                pointer: {
                    width: 5,
                    length: "80%",
                    offsetCenter: [0, "8%"],
                },
                data: [
                    {
                        value: 20,
                        // name: "Good",
                        // title: {
                        //   offsetCenter: ["-30%", "80%"],
                        // },
                        // pointer: {
                        //   width: 3,
                        //   length: "90%",
                        //   // icon: "path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z",
                        //   itemStyle: {
                        //     color: "#aaa",
                        //   },
                        // },
                        detail: {
                            // color: "#aaa",
                            // color: "#000",
                            backgroundColor: "transparent",
                            fontSize: 30,
                            offsetCenter: ["0%", "50%"],
                        },
                    },
                ],
                splitLine: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
                title: {
                    fontSize: 14,
                    text: "Distribution of Electricity",
                    subtext: "Fake Data",
                },
                detail: {
                    width: 40,
                    height: 14,
                    fontSize: 14,
                    color: "#fff",
                    backgroundColor: "inherit",
                    borderRadius: 3,
                    formatter: "{value} m/s",
                },
            },
        ],
    };

    const optionsPower = {
        series: [
            {
                type: "gauge",
                startAngle: 180,
                radius: "65%",
                endAngle: 0,
                center: ["50%", "58%"],
                splitNumber: 10,
                itemStyle: {
                    color: "#41b8d5",
                    shadowColor: "rgba(0,138,255,0.45)",
                    shadowBlur: 10,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                },
                progress: {
                    width: 25,
                    show: true,
                    overlap: true,
                    roundCap: false,
                },
                pointer: false,
                axisTick: {
                    show: false,
                },
                axisLine: {
                    width: 25,
                    lineStyle: {
                        color: [[1, "#6ce5e8"]],
                        width: 25,
                    },
                    roundCap: false,
                },
                data: [
                    {
                        value: 80,
                        // name: "Good",
                        // title: {
                        //   offsetCenter: ["-30%", "80%"],
                        // },
                        // pointer: {
                        //   width: 3,
                        //   length: "90%",
                        //   // icon: "path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z",
                        //   itemStyle: {
                        //     color: "#aaa",
                        //   },
                        // },
                        detail: {
                            // color: "#aaa",
                            // color: "#000",
                            backgroundColor: "transparent",
                            fontSize: 30,
                            offsetCenter: ["0%", "50%"],
                        },
                    },
                ],
                splitLine: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
                title: {
                    fontSize: 14,
                    text: "Distribution of Electricity",
                    subtext: "Fake Data",
                },
                detail: {
                    width: 40,
                    height: 14,
                    fontSize: 14,
                    color: "#fff",
                    backgroundColor: "inherit",
                    borderRadius: 3,
                    formatter: "{value} W",
                },
            },
        ],
    };

    const optionsEnergy = {
        series: [
            {
                type: "gauge",
                startAngle: 180,
                radius: "65%",
                endAngle: 0,
                center: ["50%", "58%"],
                splitNumber: 10,
                itemStyle: {
                    color: "#41b8d5",
                    shadowColor: "rgba(0,138,255,0.45)",
                    shadowBlur: 10,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                },
                progress: {
                    width: 25,
                    show: true,
                    overlap: true,
                    roundCap: false,
                },
                pointer: false,
                axisTick: {
                    show: false,
                },
                axisLine: {
                    width: 25,
                    lineStyle: {
                        color: [[1, "#6ce5e8"]],
                        width: 25,
                    },
                    roundCap: false,
                },
                data: [
                    {
                        value: 20,
                        // name: "Good",
                        // title: {
                        //   offsetCenter: ["-30%", "80%"],
                        // },
                        // pointer: {
                        //   width: 3,
                        //   length: "90%",
                        //   // icon: "path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z",
                        //   itemStyle: {
                        //     color: "#aaa",
                        //   },
                        // },
                        detail: {
                            // color: "#aaa",
                            // color: "#000",
                            backgroundColor: "transparent",
                            fontSize: 30,
                            offsetCenter: ["0%", "50%"],
                        },
                    },
                ],
                splitLine: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
                title: {
                    fontSize: 14,
                    text: "Distribution of Electricity",
                    subtext: "Fake Data",
                },
                detail: {
                    width: 40,
                    height: 14,
                    fontSize: 14,
                    color: "#fff",
                    backgroundColor: "inherit",
                    borderRadius: 3,
                    formatter: "{value} kWh",
                },
            },
        ],
    };

    const optionsVoltage = {
        // title: {
        //     text: "Stacked Line",
        // },
        backgroundColor: "rgba(255,255,255,0.8)", // warna latar belakang chart
        tooltip: {
            trigger: "axis",
        },
        legend: {
            top: 20, // Geser legend ke bawah
            data: ["Voltage", "Current"],
        },
        grid: {
            left: "3%",
            right: "4%",
            bottom: "7%",
            top: "30%",
            containLabel: true,
        },
        toolbox: {
            top: 20, // Geser toolbox ke bawah
            right: 10,
            feature: {
                saveAsImage: {},
            },
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
            data: ["08:00", "09:00", "16:00", "16:30"],
        },
        yAxis: {
            type: "value",
            axisLine: {
                lineStyle: {
                    color: "#000000", // garis x-axis warna hitam
                },
            },
        },
        series: [
            {
                name: "Voltage",
                type: "line",
                showSymbol: false,
                data: [100, 130, 138, 150],
            },
            {
                name: "Current",
                type: "line",
                showSymbol: false,
                data: [120, 120, 150, 134],
            },
        ],
    };

    const [run, setRun] = useState(false);
    const [play, setPlay] = useState(false);

    const steps = [
        {
            selector: "#play-button",
            content: "Klik tombol ini untuk memulai record!",
        },
        {
            selector: "#card-rpm",
            content:
                "RPM: Ini adalah kecepatan pedal dalam putaran per menit (RPM).",
        },
        {
            selector: "#card-power",
            content:
                "Daya: Ini menunjukkan daya yang dihasilkan oleh sepeda statis dalam watt (W).",
        },
        {
            selector: "#card-energy",
            content:
                "Energi: Ini adalah total energi yang dihasilkan oleh sepeda statis dalam kilowatt-jam (kWh).",
        },
        {
            selector: "#card-voltage",
            content:
                "Tegangan & Arus: Ini menunjukkan tegangan dan arus yang dihasilkan oleh sepeda statis.",
        },
    ];

    const [data, setData] = useState(null);
    const socketRef = useRef(null);
    // ⏱️ Auto start saat komponen pertama kali render
    useEffect(() => {
        // Hubungkan ke WebSocket dari Node-RED
        socketRef.current = new WebSocket("ws://localhost:1880/ws/esp32");

        // Saat koneksi terbuka
        socketRef.current.onopen = () => {
            console.log("WebSocket connected to Node-RED");
        };

        // Saat menerima pesan
        socketRef.current.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                setData(message);
            } catch (e) {
                console.error("Invalid JSON:", event.data);
            }
        };

        // Saat koneksi ditutup
        socketRef.current.onclose = () => {
            console.log("WebSocket disconnected");
        };

        const timer = setTimeout(() => setRun(true), 500); // Delay kecil agar DOM siap
        return () => {
            socketRef.current.close();
            clearTimeout(timer);
        };
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div>
                <Tour
                    steps={steps}
                    isOpen={run}
                    onRequestClose={() => setRun(false)}
                    accentColor="#4F46E5"
                />
                <div className="mx-auto max-w-8xl sm:px-6 lg:px-8">
                    <div className="p-2 text-white text-3xl ">Dashboard</div>
                    <div style={{ padding: 20 }}>
                        <h2>Data Real-Time dari Node-RED</h2>
                        {data ? (
                            <pre>{JSON.stringify(data, null, 2)}</pre>
                        ) : (
                            "Menunggu data..."
                        )}
                    </div>
                    <div className="text-right mt-1">
                        <div className="p-3 buttonwrapper text-white text-md text-right">
                            {new Date().toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    </div>
                    <div className="mt-3 flex flex-col sm:flex-row gap-3">
                        <Card
                            className="relative text-white w-full sm:w-1/3 [&>div]:justify-start "
                            imgAlt="Meaningful alt text for an image that is not purely decorative"
                            imgSrc="/img/illbike.png"
                        >
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Hello, <br />
                                {user.name}!
                            </h2>
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Static Bike for Energy Generation
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                Pedal power with a purpose — this stationary
                                bike isn't just for fitness, it converts your
                                motion into usable electricity. Monitor your
                                energy output and turn exercise into clean,
                                renewable power.
                            </p>
                            {play ? (
                                <HiPause
                                    id="play-button"
                                    className="absolute top-4 right-4 z-10 w-12 h-12 sm:w-12 sm:h-12"
                                    style={{
                                        color: "rgba(24, 22, 70, 0.8)",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setPlay(false)}
                                />
                            ) : (
                                <HiPlay
                                    id="play-button"
                                    className="absolute top-4 right-4 z-10 w-12 h-12 sm:w-12 sm:h-12"
                                    style={{
                                        color: "rgba(24, 22, 70, 0.8)",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        setPlay(true);
                                    }}
                                />
                            )}
                        </Card>

                        <div className="w-full sm:w-2/3 flex flex-row flex-col rounded-lg">
                            {/* Konten pendamping (grafik, statistik, dsb) */}
                            <div className="w-full flex flex-col sm:flex-row rounded-lg">
                                <Card
                                    id="card-rpm"
                                    className="sm:w-1/3 w-full m-1"
                                    style={{
                                        backgroundColor:
                                            "rgba(24, 22, 70, 0.8)",
                                        borderColor: "transparent",
                                        color: "white",
                                    }}
                                >
                                    <span className="xl:text-2xl text-xl">
                                        RPM
                                    </span>
                                    <ReactEcharts
                                        option={optionsRPM}
                                        style={{
                                            height: "280px",
                                            width: "100%",
                                            position: "relative",
                                        }}
                                    />
                                </Card>
                                <Card
                                    id="card-power"
                                    className="sm:w-1/3 w-full m-1"
                                    style={{
                                        backgroundColor:
                                            "rgba(24, 22, 70, 0.8)",
                                        borderColor: "transparent",
                                        color: "white",
                                    }}
                                >
                                    <span className="xl:text-2xl text-xl">
                                        Daya
                                    </span>
                                    <ReactEcharts
                                        option={optionsPower}
                                        style={{
                                            height: "280px",
                                            width: "100%",
                                            position: "relative",
                                        }}
                                    />
                                </Card>
                                <Card
                                    id="card-energy"
                                    className="sm:w-1/3 w-full m-1"
                                    style={{
                                        backgroundColor:
                                            "rgba(24, 22, 70, 0.8)",
                                        borderColor: "transparent",
                                        color: "white",
                                    }}
                                >
                                    <span className="xl:text-2xl text-xl">
                                        Energy
                                    </span>
                                    <ReactEcharts
                                        option={optionsEnergy}
                                        style={{
                                            height: "280px",
                                            width: "100%",
                                            position: "relative",
                                        }}
                                    />
                                </Card>
                            </div>
                            <div className="w-full rounded-lg">
                                <Card
                                    id="card-voltage"
                                    className="w-full m-1"
                                    style={{
                                        backgroundColor:
                                            "rgba(24, 22, 70, 0.8)",
                                        borderColor: "transparent",
                                        color: "white",
                                    }}
                                >
                                    <span className="xl:text-2xl text-xl">
                                        Voltage & Current
                                    </span>
                                    <ReactEcharts
                                        option={optionsVoltage}
                                        style={{
                                            height: "280px",
                                            width: "100%",
                                            position: "relative",
                                        }}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
