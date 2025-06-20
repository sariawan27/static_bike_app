import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Card } from "flowbite-react";

export default function Dashboard() {
    console.log(
        window.location.href.split("/").filter(Boolean)[2],
        "Dashboard"
    );
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
                <div className="mx-auto max-w-8xl sm:px-6 lg:px-8">
                    <div className="p-2 text-white text-3xl ">Dashboard</div>
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
                            className="text-white w-full sm:w-1/3"
                            imgAlt="Meaningful alt text for an image that is not purely decorative"
                            imgSrc="/img/illbike.png"
                        >
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
                        </Card>

                        <div className="w-full sm:w-2/3 rounded-lg p-4 shadow">
                            {/* Konten pendamping (grafik, statistik, dsb) */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
