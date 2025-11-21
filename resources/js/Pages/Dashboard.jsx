import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Button, Card, Tooltip } from "flowbite-react";
import ReactEcharts from "echarts-for-react";
import { HiPause, HiPlay } from "react-icons/hi";
import Tour from "reactour";
import { useEffect, useRef, useState } from "react";
import moment from "moment-timezone";

import { io } from "socket.io-client";
import Swal from "sweetalert2";

export default function Dashboard() {
    console.log(
        window.location.href.split("/").filter(Boolean)[2],
        "Dashboard"
    );

    const [rpm, setRpm] = useState({ value: null, ts: Date.now() });
    const [startDate, setStartDate] = useState(null);
    const startTimeRef = useRef(null);
    const [data, setData] = useState([]);
    const [voltage, setVoltage] = useState([]);
    const [current, setCurrent] = useState([]);
    const [energy, setEnergy] = useState(0);
    const [daya, setDaya] = useState([]);
    const [timestamp, setTimestamp] = useState([]);

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
                        value: data[1] ? data[1] : 0,
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
                    formatter: "{value} KM/H",
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
                        value: data[4] ? data[4] : 0,
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
                    formatter: "{value} J",
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
                                "ws://localhost:1880/trigger-run"
                            );

                            // Saat koneksi terbuka
                            socketRef.current.onopen = () => {
                                console.log("WebSocket connected to Node-RED");
                                // langsung start
                                socketRef.current.send(
                                    JSON.stringify({
                                        action: "stop",
                                    })
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
                            "ws://localhost:1880/trigger-run"
                        );

                        // Saat koneksi terbuka
                        socketRef.current.onopen = () => {
                            console.log("WebSocket connected to Node-RED");
                            // langsung start
                            socketRef.current.send(
                                JSON.stringify({
                                    action: "stop",
                                })
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
    }, [rpm]);
    console.log(startDate, "startdate di dashboard");
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
                        <div className="p-2 text-white text-3xl ">
                            Dashboard
                        </div>
                        <div className="text-right mt-1 button-container">
                            <div className="p-3 text-white text-md text-right its">
                                {new Date().toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
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
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Hello, <br />
                                    {user.name}!
                                </h2>
                                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Static Bike for Energy Generation
                                </h5>
                                <p className="font-normal text-gray-700 dark:text-gray-400">
                                    Pedal power with a purpose — this stationary
                                    bike isn't just for fitness, it converts
                                    your motion into usable electricity. Monitor
                                    your energy output and turn exercise into
                                    clean, renewable power.
                                </p>
                                {play ? (
                                    <HiPause
                                        id="play-button"
                                        className="absolute top-4 right-4 z-10 w-12 h-12 sm:w-12 sm:h-12"
                                        style={{
                                            color: "rgba(24, 22, 70, 0.8)",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            setTimestamp([]);
                                            setVoltage([]);
                                            setCurrent([]);
                                            setDaya([]);
                                            setData([]);
                                            setEnergy(0);
                                            // Hubungkan ke WebSocket dari Node-RED
                                            socketRef.current = new WebSocket(
                                                "ws://localhost:1880/trigger-run"
                                            );

                                            // Saat koneksi terbuka
                                            socketRef.current.onopen = () => {
                                                console.log(
                                                    "WebSocket connected to Node-RED"
                                                );
                                                // langsung start
                                                socketRef.current.send(
                                                    JSON.stringify({
                                                        action: "stop",
                                                    })
                                                );
                                            };

                                            // Saat menerima pesan
                                            socketRef.current.onmessage = (
                                                event
                                            ) => {
                                                try {
                                                    const message = JSON.parse(
                                                        event.data
                                                    );
                                                    console.log(message);
                                                } catch (e) {
                                                    console.error(
                                                        "Invalid JSON:",
                                                        event.data
                                                    );
                                                }
                                            };

                                            // Saat koneksi ditutup
                                            socketRef.current.onclose = () => {
                                                console.log(
                                                    "WebSocket disconnected"
                                                );
                                            };
                                            setPlay(false);
                                        }}
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
                                            setStartDate(new Date());
                                            setPlay(true);

                                            // Hubungkan ke WebSocket dari Node-RED
                                            socketRef.current = new WebSocket(
                                                "ws://localhost:1880/trigger-run"
                                            );

                                            // Saat koneksi terbuka
                                            socketRef.current.onopen = () => {
                                                console.log(
                                                    "WebSocket connected to Node-RED"
                                                );
                                                // langsung start
                                                socketRef.current.send(
                                                    JSON.stringify({
                                                        action: "start",
                                                    })
                                                );
                                            };

                                            // Saat menerima pesan
                                            socketRef.current.onmessage = (
                                                event
                                            ) => {
                                                try {
                                                    const message = JSON.parse(
                                                        event.data
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
                                                            0
                                                        ) + message[5];
                                                    setEnergy(
                                                        (x) => x + message[5]
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
                                                } catch (e) {
                                                    console.error(
                                                        "Invalid JSON:",
                                                        event.data
                                                    );
                                                }
                                            };

                                            // Saat koneksi ditutup
                                            socketRef.current.onclose = () => {
                                                console.log(
                                                    "WebSocket disconnected"
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
            </div>
        </AuthenticatedLayout>
    );
}
