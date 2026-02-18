import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import {
    Button,
    Card,
    Modal,
    ModalBody,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    Tooltip,
} from "flowbite-react";
import ReactEcharts from "echarts-for-react";
import { HiPause, HiPlay } from "react-icons/hi";
import Tour from "reactour";
import { useEffect, useRef, useState } from "react";
import moment from "moment-timezone";

import { io } from "socket.io-client";
import Swal from "sweetalert2";
import BatteryGauge from "react-battery-gauge";
import { Trophy, Medal, Award } from "lucide-react";

const topScores = [
    { rank: 1, name: "Ahmad Diallo Stephant Williz", score: 2850 },
    { rank: 2, name: "Budi", score: 2340 },
    { rank: 3, name: "Citra", score: 1980 },
];

const getRankIcon = (rank) => {
    switch (rank) {
        case 1:
            return <Trophy className="w-5 h-5 text-gold" />;
        case 2:
            return <Medal className="w-5 h-5 text-silver" />;
        case 3:
            return <Award className="w-5 h-5 text-bronze" />;
        default:
            return null;
    }
};

const getRankBg = (rank) => {
    switch (rank) {
        case 1:
            return "bg-gold/10 border-gold/30";
        case 2:
            return "bg-silver/10 border-silver/30";
        case 3:
            return "bg-bronze/10 border-bronze/30";
        default:
            return "bg-card border-border";
    }
};

export default function Dashboard({ ranking }) {
    console.log(
        window.location.href.split("/").filter(Boolean)[2],
        "Dashboard",
    );
    console.log(ranking, "dashboard props ranking");

    const [openModal, setOpenModal] = useState(false);
    const [openModalDone, setOpenModalDone] = useState(false);
    const [rpm, setRpm] = useState({ value: null, ts: Date.now() });
    const [startDate, setStartDate] = useState(null);
    const startTimeRef = useRef(null);
    const [data, setData] = useState([]);
    const [dataBattery, setDataBattery] = useState([]);
    const [dataSoc, setDataSoc] = useState([]);
    const [voltage, setVoltage] = useState([]);
    const [current, setCurrent] = useState([]);
    const [energy, setEnergy] = useState(0);
    const [daya, setDaya] = useState([]);
    const [timestamp, setTimestamp] = useState([]);
    const [myScore, setMyScore] = useState(null);
    const [batteryStored, setBatteryStored] = useState(0);

    const user = usePage().props.auth.user;

    const fullscreenRef = useRef(null);

    const toggleFullscreen = () => {
        const elem = fullscreenRef.current;

        if (!document.fullscreenElement) {
            // Masuk fullscreen
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                // Firefox
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                // Chrome, Safari, Opera
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                // IE/Edge
                elem.msRequestFullscreen();
            }
        } else {
            // Keluar fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };

    const optionsRPM = {
        series: [
            {
                type: "gauge",
                startAngle: 180,
                radius: "65%",
                endAngle: 0,
                center: ["50%", "58%"],
                splitNumber: 10,
                max: 43,
                // itemStyle: {
                //     color: "#41b8d5",
                //     shadowColor: "rgba(0,138,255,0.45)",
                //     shadowBlur: 10,
                //     shadowOffsetX: 2,
                //     shadowOffsetY: 2,
                // },
                // progress: {
                //     width: 25,
                //     show: true,
                //     overlap: true,
                //     roundCap: false,
                // },
                axisLine: {
                    width: 25,
                    lineStyle: {
                        color: [
                            [0.73, "#67e0e3"],
                            [0.9, "#f8c630"],
                            [1, "#fd666d"],
                        ],
                        width: 25,
                    },
                    roundCap: false,
                },
                pointer: {
                    itemStyle: {
                        color: "auto",
                    },
                    width: 5,
                    length: "80%",
                    offsetCenter: [0, "8%"],
                },
                data: [
                    {
                        value: data[1] ? data[1] : 0,
                        // value: 100,
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
                    valueAnimation: true,
                    width: 40,
                    height: 14,
                    fontSize: 14,
                    color: "#fff",
                    backgroundColor: "inherit",
                    borderRadius: 3,
                    formatter: function (value) {
                        return (
                            `{main|${value} KM/H}\n` +
                            `{sub|(${
                                data[data?.length - 1]
                                    ? data[data?.length - 1]
                                    : 0
                            } RPM)}`
                        );
                    },
                    rich: {
                        main: {
                            fontSize: 30, // angka utama besar
                            fontWeight: "bold",
                            color: data[1]
                                ? +data[1] >= +"90"
                                    ? "#fd666d"
                                    : +data[1] >= +"73"
                                      ? "#f8c630"
                                      : "#fff"
                                : "#fff",
                        },
                        sub: {
                            fontSize: 20, // speedValue lebih kecil
                            color: data[1]
                                ? +data[1] >= +"90"
                                    ? "#fd666d"
                                    : +data[1] >= +"73"
                                      ? "#f8c630"
                                      : "#fff"
                                : "#fff",
                            padding: [4, 0, 0, 0],
                        },
                    },
                },
            },
        ],
    };

    const optionsPower = {
        series: [
            {
                type: "gauge",
                min: 0,
                max: 2400, // ⬅️ INI YANG PENTING
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
                        // value: data[4] ? data[4] : 0,
                        value: dataSoc?.socWh ? dataSoc.socWh : 0,
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
                            // color: "#000",
                            backgroundColor: "transparent",
                            fontSize: 30,
                            offsetCenter: ["0%", "50%"],
                            formatter: function (value) {
                                return `${value} Wh`;
                            },
                        },
                    },
                    {
                        value: energy ? energy.toFixed(4) : 0,
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
                            color: "#39ff14",
                            backgroundColor: "transparent",
                            fontSize: 23,
                            offsetCenter: ["0%", "89%"],
                            formatter: function (value) {
                                return `${value} Wh`;
                            },
                        },
                        progress: {
                            itemStyle: {
                                color: "#39ff14",
                            },
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
                        value: energy ? energy.toFixed(4) : 0,
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
                    formatter: "{value} Wh",
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
            data: timestamp,
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
                data: voltage,
            },
            {
                name: "Current",
                type: "line",
                showSymbol: false,
                data: current,
            },
        ],
    };
    const getBatteryPercentage = (v) => {
        if (v >= 13.8) return 100; // charging
        if (v >= 13.35 && v < 13.8) return 50;
        if (v >= 13.25 && v < 13.35) return 25;
        if (v >= 1) return 10;

        return 0; // default safety
    };
    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        return `${h} h ${m} m ${s} s`;
    };

    const [run, setRun] = useState(false);
    const [play, setPlay] = useState(false);

    const steps = [
        {
            selector: "#play-button",
            content: "Klik tombol ini untuk memulai record!",
        },
        {
            selector: "#indikator-battery",
            content: "Prosentase baterai realtime.",
        },
        {
            selector: "#top-leaders",
            content:
                "Top Leaderboard: Lihat peringkat tertinggi yang terekam sistem dalam satu sesi.",
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
    console.log(voltage, "voltage di dashboard");
    console.log(current, "current di dashboard");
    console.log(daya, "daya di dashboard");
    const socketRef = useRef(null);

    useEffect(() => {
        const { value, ts } = rpm;
        console.log(ts, "ts di dashboard");

        const currentTime = ts;

        console.log((ts - startDate) / 1000, "duration di dashboard");

        if (value <= 0.05 || value === null) {
            console.log("RPM 0 detected, starting timer...");
            if (!startTimeRef.current) {
                console.log("Timer started");
                startTimeRef.current = startDate;
            } else {
                console.log("Timer running...");
                const duration = (currentTime - startTimeRef.current) / 1000;
                if (duration >= 60 && duration <= 61) {
                    Swal.fire({
                        title: "Anda diam lebih dari 1 menit!",
                        text: "Apakah Anda ingin lanjut?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Ya, lanjut",
                        cancelButtonText: "Stop",
                        allowOutsideClick: false, // 🚫 tidak bisa klik luar
                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log("Reset dilakukan!");
                        } else {
                            // Hubungkan ke WebSocket dari Node-RED
                            socketRef.current = new WebSocket(
                                "ws://localhost:1880/trigger-run",
                            );

                            // Saat koneksi terbuka
                            socketRef.current.onopen = () => {
                                console.log("WebSocket connected to Node-RED");
                                // langsung start
                                socketRef.current.send(
                                    JSON.stringify({
                                        action: "stop",
                                    }),
                                );
                            };

                            // Saat koneksi ditutup
                            socketRef.current.onclose = () => {
                                console.log("WebSocket disconnected");
                            };
                            setTimestamp([]);
                            setVoltage([]);
                            setCurrent([]);
                            setDaya([]);
                            setData([]);
                            setEnergy(0);
                            Swal.close();
                            setPlay(false);

                            startTimeRef.current = null; // reset agar tidak spam alert
                            setStartDate(null);
                        }
                    });
                } else if (duration >= 120 && duration <= 121) {
                    // Jika sudah lebih dari 2 menit, reset timer
                    startTimeRef.current = null; // reset agar tidak spam alert
                    setStartDate(null);
                    // alert("RPM 0 lebih dari 1 menit!");
                    Swal.fire({
                        title: "Anda diam lebih dari 2 menit!",
                        text: "Sistem akan berhenti otomatis.",
                        icon: "warning",
                    }).then((result) => {
                        // Hubungkan ke WebSocket dari Node-RED
                        socketRef.current = new WebSocket(
                            "ws://localhost:1880/trigger-run",
                        );

                        // Saat koneksi terbuka
                        socketRef.current.onopen = () => {
                            console.log("WebSocket connected to Node-RED");
                            // langsung start
                            socketRef.current.send(
                                JSON.stringify({
                                    action: "stop",
                                }),
                            );
                        };

                        // Saat koneksi ditutup
                        socketRef.current.onclose = () => {
                            console.log("WebSocket disconnected");
                        };
                        setTimestamp([]);
                        setVoltage([]);
                        setCurrent([]);
                        setDaya([]);
                        setData([]);
                        setEnergy(0);

                        setPlay(false);
                    });
                }
            }
        } else {
            setStartDate(new Date());
            startTimeRef.current = null; // reset jika rpm kembali normal
        }
        setMyScore(ranking?.find((item) => item.user_id === user.id));
    }, [rpm]);
    console.log(startDate, "startdate di dashboard");
    // ⏱️ Auto start saat komponen pertama kali render
    useEffect(() => {
        // Hubungkan ke WebSocket dari Node-RED
        socketRef.current = new WebSocket("ws://localhost:8765");

        // Saat koneksi terbuka
        socketRef.current.onopen = () => {
            console.log("WebSocket connected to Node-RED");
        };

        // Saat menerima pesan
        socketRef.current.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                setDataBattery(message);
                console.log(message);
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

    useEffect(() => {
        // Hubungkan ke WebSocket dari Node-RED
        socketRef.current = new WebSocket(
            "ws://localhost:1880/trigger-bat-cap",
        );

        // Saat koneksi terbuka
        socketRef.current.onopen = () => {
            console.log("WebSocket connected to Node-RED for battery capacity");
        };

        // Saat menerima pesan
        socketRef.current.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                setDataSoc(message);
                console.log(message);
            } catch (e) {
                console.error("Invalid JSON:", event.data);
            }
        };

        // Saat koneksi ditutup
        socketRef.current.onclose = () => {
            console.log("WebSocket disconnected");
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
            <div className="p-4" ref={fullscreenRef} id="content-body">
                <Head title="Dashboard" />

                <div>
                    <Tour
                        steps={steps}
                        isOpen={run}
                        onRequestClose={() => setRun(false)}
                        accentColor="#4F46E5"
                    />
                    <div className="mx-auto max-w-8xl sm:px-6 lg:px-8">
                        <div className="text-right mt-1 button-container">
                            <div className="p-3 text-white text-md text-right its">
                                Welcome, {user.name}! 👋
                            </div>
                            <div className="p-3 text-white text-md text-right its">
                                {new Date().toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                            <div
                                className="p-3 text-white text-md text-right its flex"
                                onClick={() => setOpenModal(true)}
                                style={{ cursor: "pointer" }}
                            >
                                <svg
                                    class="w-6 h-6 text-white dark:text-white mr-1"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="m10.051 8.102-3.778.322-1.994 1.994a.94.94 0 0 0 .533 1.6l2.698.316m8.39 1.617-.322 3.78-1.994 1.994a.94.94 0 0 1-1.595-.533l-.4-2.652m8.166-11.174a1.366 1.366 0 0 0-1.12-1.12c-1.616-.279-4.906-.623-6.38.853-1.671 1.672-5.211 8.015-6.31 10.023a.932.932 0 0 0 .162 1.111l.828.835.833.832a.932.932 0 0 0 1.111.163c2.008-1.102 8.35-4.642 10.021-6.312 1.475-1.478 1.133-4.77.855-6.385Zm-2.961 3.722a1.88 1.88 0 1 1-3.76 0 1.88 1.88 0 0 1 3.76 0Z"
                                    />
                                </svg>{" "}
                                Highlight Score
                            </div>
                            <Tooltip content="Fullscreen" placement="bottom">
                                <div
                                    className="p-3 text-white text-md text-right its"
                                    // style={{ cursor: "pointer" }}
                                    onClick={() => toggleFullscreen()}
                                >
                                    <svg
                                        class="w-6 h-6 text-white dark:text-gray-800"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M8 4H4m0 0v4m0-4 5 5m7-5h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5m7 5h4m0 0v-4m0 4-5-5"
                                        />
                                    </svg>
                                </div>
                            </Tooltip>
                        </div>
                        <div className="mt-3 flex flex-col sm:flex-row gap-3">
                            <Card
                                className="relative text-white w-full sm:w-1/3 [&>div]:justify-start "
                                imgAlt="Meaningful alt text for an image that is not purely decorative"
                                imgSrc="/img/illbike.png"
                            >
                                <span id="top-leaders">
                                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        <span className="flex gap-2">
                                            <Trophy
                                                className="w-7 h-7 text-gold"
                                                style={{ alignSelf: "center" }}
                                            />
                                            Top Leaderboard
                                        </span>
                                    </h2>

                                    {/* Top 3 Scores */}
                                    <div className="space-y-3 mt-2">
                                        {!ranking ? (
                                            <></>
                                        ) : (
                                            ranking
                                                .slice(0, 3)
                                                .map((score, index) => (
                                                    <div
                                                        key={index + 1}
                                                        className={`flex items-center gap-3 p-3 rounded-xl border ${getRankBg(
                                                            index + 1,
                                                        )} transition-all duration-300 hover:scale-[1.02] animate-slide-up`}
                                                        style={{
                                                            animationDelay: `${
                                                                index * 100
                                                            }ms`,
                                                        }}
                                                    >
                                                        {/* Rank Icon */}
                                                        <div className="flex-shrink-0">
                                                            {getRankIcon(
                                                                index + 1,
                                                            )}
                                                        </div>

                                                        {/* Rank Number */}
                                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                                            <span className="text-sm font-bold text-secondary-foreground">
                                                                {index + 1}
                                                            </span>
                                                        </div>

                                                        {/* Name */}
                                                        <div className="flex-1">
                                                            <span
                                                                className="font-bold block truncate min-w-0 max-w-[100px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[220px] xl:max-w-[260px] 2xl:max-w-[320px]"
                                                                style={{
                                                                    color: "#2d4053",
                                                                    overflow:
                                                                        "hidden",
                                                                    textOverflow:
                                                                        "ellipsis",
                                                                    whiteSpace:
                                                                        "break-space",
                                                                }}
                                                            >
                                                                {(() => {
                                                                    const words =
                                                                        score.name.split(
                                                                            " ",
                                                                        );
                                                                    return words.length >
                                                                        2
                                                                        ? words
                                                                              .slice(
                                                                                  0,
                                                                                  2,
                                                                              )
                                                                              .join(
                                                                                  " ",
                                                                              ) +
                                                                              "..."
                                                                        : score.name;
                                                                })()}
                                                            </span>
                                                        </div>

                                                        {/* Score */}
                                                        <div className="text-right">
                                                            <p className="font-display font-bold text-primary text-xs">
                                                                {score.total_energy.toLocaleString()}{" "}
                                                                <span className="text-xs text-muted-foreground ml-1">
                                                                    Wh /
                                                                </span>{" "}
                                                                {(
                                                                    score.total_energy *
                                                                    3.7
                                                                )
                                                                    .toFixed(2)
                                                                    .toLocaleString()}{" "}
                                                                <span className="text-xs text-muted-foreground ml-1">
                                                                    kcal
                                                                </span>
                                                            </p>
                                                            <p className="text-xs text-muted-foreground ml-1">
                                                                {formatDuration(
                                                                    score.duration,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                        )}
                                    </div>
                                </span>

                                <BatteryGauge
                                    id="indikator-battery"
                                    className="absolute top-3 left-6 z-10 w-16 h-16 sm:w-16 sm:h-16"
                                    customization={{
                                        batteryBody: {
                                            fill: "silver",
                                            strokeColor: "#453F5F",
                                            strokeWidth: 2,
                                        },
                                        batteryCap: {
                                            capToBodyRatio: 0.4,
                                            cornerRadius: 3,
                                            fill: "silver",
                                            strokeColor: "#453E5F",
                                            strokeWidth: 0,
                                        },
                                        batteryMeter: {
                                            noOfCells: 4,
                                            lowBatteryValue: 10,
                                            lowBatteryFill: "red",
                                        },
                                        readingText: {
                                            darkContrastColor: "white",
                                            fontFamily: "Arial",
                                            fontSize: 18,
                                            lightContrastColor: "black",
                                            lowBatteryColor: "red",
                                            // showPercentage: false,
                                        },
                                    }}
                                    value={dataSoc?.soc}
                                    // value={getBatteryPercentage(
                                    //     dataBattery?.data?.voltage,
                                    // )}
                                />
                                {play ? (
                                    <HiPause
                                        id="play-button"
                                        className="absolute top-4 right-4 z-10 w-16 h-16 sm:w-16 sm:h-16"
                                        style={{
                                            color: "rgba(24, 22, 70, 0.8)",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            setBatteryStored(energy.toFixed(2));
                                            setTimestamp([]);
                                            setVoltage([]);
                                            setCurrent([]);
                                            setDaya([]);
                                            setData([]);
                                            setEnergy(0);
                                            // Hubungkan ke WebSocket dari Node-RED
                                            socketRef.current = new WebSocket(
                                                "ws://localhost:1880/trigger-run",
                                            );

                                            // Saat koneksi terbuka
                                            socketRef.current.onopen = () => {
                                                console.log(
                                                    "WebSocket connected to Node-RED",
                                                );
                                                // langsung start
                                                socketRef.current.send(
                                                    JSON.stringify({
                                                        action: "stop",
                                                    }),
                                                );
                                            };

                                            // Saat menerima pesan
                                            socketRef.current.onmessage = (
                                                event,
                                            ) => {
                                                try {
                                                    const message = JSON.parse(
                                                        event.data,
                                                    );
                                                    console.log(message);
                                                } catch (e) {
                                                    console.error(
                                                        "Invalid JSON:",
                                                        event.data,
                                                    );
                                                }
                                            };

                                            // Saat koneksi ditutup
                                            socketRef.current.onclose = () => {
                                                console.log(
                                                    "WebSocket disconnected",
                                                );
                                            };
                                            setPlay(false);
                                            setOpenModalDone(true);
                                        }}
                                    />
                                ) : (
                                    <HiPlay
                                        id="play-button"
                                        className="absolute top-4 right-4 z-10 w-16 h-16 sm:w-16 sm:h-16"
                                        style={{
                                            color: "rgba(24, 22, 70, 0.8)",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            setStartDate(new Date());
                                            setPlay(true);

                                            // Hubungkan ke WebSocket dari Node-RED
                                            socketRef.current = new WebSocket(
                                                "ws://localhost:1880/trigger-run",
                                            );

                                            // Saat koneksi terbuka
                                            socketRef.current.onopen = () => {
                                                console.log(
                                                    "WebSocket connected to Node-RED",
                                                );
                                                // langsung start
                                                socketRef.current.send(
                                                    JSON.stringify({
                                                        action: "start",
                                                    }),
                                                );
                                            };

                                            // Saat menerima pesan
                                            socketRef.current.onmessage = (
                                                event,
                                            ) => {
                                                try {
                                                    const message = JSON.parse(
                                                        event.data,
                                                    );
                                                    setTimestamp((prev) => [
                                                        ...prev,
                                                        moment(message[7])
                                                            .tz("Asia/Jakarta")
                                                            .format("HH:mm:ss"),
                                                    ]);
                                                    setVoltage((prev) => [
                                                        ...prev,
                                                        message[2],
                                                    ]);
                                                    setCurrent((prev) => [
                                                        ...prev,
                                                        message[3],
                                                    ]);
                                                    const sum =
                                                        daya.reduce(
                                                            (a, b) => a + b,
                                                            0,
                                                        ) + message[5];
                                                    setEnergy(
                                                        (x) => x + message[5],
                                                    );
                                                    setDaya((prev) => [
                                                        ...prev,
                                                        message[4],
                                                    ]);
                                                    console.log(message);
                                                    setData(message);
                                                    setRpm({
                                                        value: message[1],
                                                        ts: Date.now(),
                                                    });
                                                    if (message[1] >= 39) {
                                                        Swal.fire({
                                                            timer: 2000,
                                                            title: "Kecepatan tinggi!",
                                                            text: "Kurangi kecepatan Anda!",
                                                            icon: "warning",
                                                            showConfirmButton: false,
                                                        });
                                                    }
                                                } catch (e) {
                                                    console.error(
                                                        "Invalid JSON:",
                                                        event.data,
                                                    );
                                                }
                                            };

                                            // Saat koneksi ditutup
                                            socketRef.current.onclose = () => {
                                                console.log(
                                                    "WebSocket disconnected",
                                                );
                                            };
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
                                            Speed
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
                                            E Produced (Wh)
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
            </div>

            <Modal
                show={openModalDone}
                size="lg"
                popup
                position="top-center"
                onClose={() => {
                    setOpenModalDone(false);

                    window.location.reload();
                    toggleFullscreen();
                }}
                root={document.fullscreenElement || document.body}
            >
                <ModalHeader />
                <ModalBody style={{ textAlign: "center" }}>
                    <div className="space-y-6">
                        <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                            {batteryStored} Wh
                        </h2>
                        <p className="text-xl font-medium text-gray-900 dark:text-white">
                            Your energy has been successfully stored!
                        </p>
                        <p className="text-xl font-medium text-gray-900 dark:text-white">
                            (Tanpa menghitung beban auxilarry)
                        </p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={() => {
                                setOpenModalDone(false);

                                window.location.reload();
                                toggleFullscreen();
                            }}
                        >
                            Close
                        </button>
                        <button
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded ml-2"
                            onClick={() => {
                                setOpenModalDone(false);
                                window.location.href = "/trending";
                            }}
                        >
                            Go to Trending
                        </button>
                    </div>
                </ModalBody>
            </Modal>
            <Modal
                show={openModal}
                size="lg"
                popup
                position="top-center"
                onClose={() => {
                    setOpenModal(false);
                }}
                root={document.fullscreenElement || document.body}
            >
                <ModalHeader />
                <ModalBody>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            Highlight Score
                        </h3>
                        <div
                            className="overflow-x-auto"
                            style={{
                                height: "320px",
                            }}
                        >
                            <Table striped>
                                <TableHead
                                    style={{ backgroundColor: "#1B2453" }}
                                >
                                    <TableHeadCell
                                        style={{
                                            backgroundColor: "#1B2453",
                                            color: "white",
                                        }}
                                    >
                                        No
                                    </TableHeadCell>
                                    <TableHeadCell
                                        style={{
                                            backgroundColor: "#1B2453",
                                            color: "white",
                                        }}
                                    >
                                        Name
                                    </TableHeadCell>
                                    <TableHeadCell
                                        style={{
                                            backgroundColor: "#1B2453",
                                            color: "white",
                                        }}
                                    >
                                        Energy Produced / Kalori
                                    </TableHeadCell>
                                    <TableHeadCell
                                        style={{
                                            backgroundColor: "#1B2453",
                                            color: "white",
                                        }}
                                    >
                                        Durasi
                                    </TableHeadCell>
                                </TableHead>
                                <TableBody
                                    className="divide-y"
                                    style={{
                                        maxHeight: "400px",
                                    }}
                                >
                                    {ranking ? (
                                        ranking.map((rank, index) => (
                                            <>
                                                <TableRow
                                                    className="dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white"
                                                    style={{
                                                        backgroundColor:
                                                            index + 1 == 1
                                                                ? "#D4AF37"
                                                                : index + 1 == 2
                                                                  ? "#C0C0C0"
                                                                  : index + 1 ==
                                                                      3
                                                                    ? "#CD7F32"
                                                                    : "transparent",
                                                    }}
                                                >
                                                    <TableCell>
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                        {rank.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {rank.total_energy} Wh /{" "}
                                                        {(
                                                            rank.total_energy *
                                                            3.7
                                                        ).toFixed(4)}{" "}
                                                        kcal
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDuration(
                                                            rank.duration,
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div
                            className={`flex items-center gap-3 p-3 rounded-xl border  border-border transition-all duration-300 hover:scale-[1.02] animate-slide-up`}
                        >
                            {/* Rank Number */}
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                <span className="text-sm font-bold text-secondary-foreground">
                                    {myScore != null
                                        ? ranking?.findIndex(
                                              (item) =>
                                                  item.user_id === user.id,
                                          ) + 1
                                        : "-"}
                                </span>
                            </div>

                            {/* Name */}
                            <div className="flex-1">
                                <span
                                    className="font-bold block truncate min-w-0 max-w-[100px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[220px] xl:max-w-[260px] 2xl:max-w-[320px]"
                                    style={{
                                        color: "#2d4053",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "break-space",
                                    }}
                                >
                                    {(() => {
                                        const words =
                                            myScore != null
                                                ? myScore.name.split(" ")
                                                : user.name.split(" ");
                                        return words.length > 2
                                            ? words.slice(0, 2).join(" ") +
                                                  "..."
                                            : myScore != null
                                              ? myScore.name.split(" ")
                                              : user.name.split(" ");
                                    })()}
                                </span>
                            </div>

                            {/* Score */}
                            <div className="text-right">
                                <p className="font-display font-bold text-primary text-xs">
                                    {/* {score.total_energy.toLocaleString()}{" "} */}
                                    {myScore != null
                                        ? myScore.total_energy.toLocaleString()
                                        : 0}
                                    <span className="text-xs text-muted-foreground ml-1">
                                        Wh /
                                    </span>{" "}
                                    {myScore != null
                                        ? (myScore.total_energy * 3.7)
                                              .toFixed(2)
                                              .toLocaleString()
                                        : 0}
                                    <span className="text-xs text-muted-foreground ml-1">
                                        kcal
                                    </span>
                                </p>
                                <p className="text-xs text-muted-foreground ml-1">
                                    {myScore != null
                                        ? formatDuration(myScore.duration)
                                        : 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </AuthenticatedLayout>
    );
}
