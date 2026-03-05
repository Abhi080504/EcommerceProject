import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../State/hooks";
import { useNavigate } from "react-router-dom";
import { api } from "../../../config/Api";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    CircularProgress,
    Box,
    Button
} from "@mui/material";
import {
    People,
    Store,
    AdminPanelSettings,
    VerifiedUser,
    Pending,
    Logout,
    ArrowBack
} from "@mui/icons-material";
import { useAppDispatch } from "../../../State/hooks";
import { performLogout } from "../../../State/Auth/authSlice";

const SuperAdminDashboard = () => {
    const { user, loading: authLoading } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [view, setView] = useState("DASHBOARD"); // DASHBOARD, CUSTOMERS, SELLERS, ADMINS
    const [sellerFilter, setSellerFilter] = useState("ALL"); // ALL, ACTIVE, PENDING_VERIFICATION
    const [admins, setAdmins] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [sellers, setSellers] = useState<any[]>([]);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
            navigate("/");
            return;
        }

        if (authLoading || !user) {
            return;
        }

        if (user.role !== "ROLE_SUPER") {
            navigate("/");
            return;
        }

        const fetchData = async () => {
            try {
                const res = await api.get("/super-admin/dashboard");
                setMetrics(res.data.data);
            } catch (error) {
                console.error("Failed to fetch super admin metrics", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchAdmins = async () => {
            try {
                const res = await api.get("/super-admin/admins");
                setAdmins(res.data.data);
            } catch (err) {
                console.log(err);
            }
        }

        // Initial fetch: Only Dashboard Metrics and Admins (Default View)
        fetchData();
        fetchAdmins();

    }, [user, authLoading, navigate]);

    // Lazy load Customers
    useEffect(() => {
        if (view === "CUSTOMERS" && customers.length === 0) {
            const fetchCustomers = async () => {
                try {
                    const res = await api.get("/super-admin/customers");
                    setCustomers(res.data.data);
                } catch (err) {
                    console.log(err);
                }
            }
            fetchCustomers();
        }
    }, [view, customers.length]);

    // Lazy load Sellers
    useEffect(() => {
        if (view === "SELLERS" && sellers.length === 0) {
            const fetchSellers = async () => {
                try {
                    const res = await api.get("/sellers");
                    setSellers(res.data.data);
                } catch (err) {
                    console.log(err);
                }
            }
            fetchSellers();
        }
    }, [view, sellers.length]);

    const handleStatusChange = async (id: number, currentStatus: string, type: string) => {
        const newStatus = currentStatus === "ACTIVE" ? "PENDING_VERIFICATION" : "ACTIVE";
        try {
            if (type === "ADMINS") {
                await api.patch(`/super-admin/admin/${id}/status/${newStatus}`);
                setAdmins(admins.map((admin: any) =>
                    admin.id === id ? { ...admin, accountStatus: newStatus } : admin
                ));
            } else if (type === "SELLERS") {
                // Endpoint from AdminController
                // BaseURL includes /api, so we just need /seller/...
                await api.patch(`/seller/${id}/status/${newStatus}`);
                setSellers(sellers.map((seller: any) =>
                    seller.id === id ? { ...seller, accountStatus: newStatus } : seller
                ));
            }
        } catch (error: any) {
            console.error("Failed to update status", error);
            alert("Update Failed: " + (error.response?.data?.message || error.message));
        }
    };

    const handleLogout = () => {
        dispatch(performLogout());
    }

    if (authLoading || (localStorage.getItem("jwt") && !user)) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#FDFBF7]">
                <CircularProgress sx={{ color: "#F9B233" }} />
            </div>
        );
    }

    if (!user || user.role !== "ROLE_SUPER") {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#FDFBF7]">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#FDFBF7]">
                <CircularProgress sx={{ color: "#F9B233" }} />
            </div>
        );
    }

    const MetricCard = ({ title, value, icon, color, onClick }: any) => (
        <Card
            onClick={onClick}
            sx={{
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                height: "100%",
                cursor: onClick ? "pointer" : "default",
                transition: "transform 0.2s",
                "&:hover": onClick ? { transform: "translateY(-5px)" } : {}
            }}
        >
            <CardContent className="flex items-center justify-between p-6">
                <div>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold" sx={{ color }}>
                        {value}
                    </Typography>
                </div>
                <Box sx={{ backgroundColor: `${color}20`, borderRadius: "50%", p: 2 }}>
                    {icon}
                </Box>
            </CardContent>
        </Card>
    );

    const renderTable = (data: any[], type: string) => {
        const displayedData = type === "SELLERS" && sellerFilter !== "ALL"
            ? data.filter(item => item.accountStatus === sellerFilter)
            : data;

        return (
            <div className="bg-white rounded-2xl shadow-sm p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#3E2C1E]">
                        {type === "CUSTOMERS" && "All Customers"}
                        {type === "SELLERS" && (sellerFilter === "ALL" ? "All Sellers" : (sellerFilter === "ACTIVE" ? "Active Sellers" : "Pending Sellers"))}
                        {type === "ADMINS" && "Admin Management"}
                    </h2>
                    <Button startIcon={<ArrowBack />} onClick={() => setView("DASHBOARD")}>
                        Back to Dashboard
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-4 px-4 font-semibold text-gray-600">Name</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-600">Email</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-600">Mobile</th>
                                {type !== "CUSTOMERS" && <th className="text-left py-4 px-4 font-semibold text-gray-600">Status</th>}

                                {(type === "ADMINS" || type === "SELLERS") && <th className="text-left py-4 px-4 font-semibold text-gray-600">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {displayedData.map((item) => (
                                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4 text-gray-800">
                                        {type === "SELLERS" ? item.sellerName : item.fullName}
                                        {type === "SELLERS" && item.bussinessDetails?.bussinessName && (
                                            <div className="text-xs text-gray-500">{item.bussinessDetails.bussinessName}</div>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-gray-600">{item.email}</td>
                                    <td className="py-4 px-4 text-gray-600">{item.mobile}</td>
                                    {type !== "CUSTOMERS" && (
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.accountStatus === 'ACTIVE'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {item.accountStatus}
                                            </span>
                                        </td>
                                    )}
                                    {(type === "ADMINS" || type === "SELLERS") && (
                                        <td className="py-4 px-4">
                                            <button
                                                onClick={() => handleStatusChange(item.id, item.accountStatus, type)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${item.accountStatus === 'ACTIVE'
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                    }`}
                                            >
                                                {item.accountStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {displayedData.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No records found.</div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black text-[#3E2C1E]">
                        {view === "DASHBOARD" ? "Super Admin Dashboard" : "Management Console"}
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
                    >
                        <Logout fontSize="small" />
                        Logout
                    </button>
                </div>

                {view === "DASHBOARD" && (
                    <>
                        <Grid container spacing={4} className="mb-12">
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <MetricCard
                                    title="Total Customers"
                                    value={metrics?.totalUsers || 0}
                                    icon={<People sx={{ fontSize: 40, color: "#1976D2" }} />}
                                    color="#1976D2"
                                    onClick={() => setView("CUSTOMERS")}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <MetricCard
                                    title="Total Admins"
                                    value={metrics?.totalAdmins || 0}
                                    icon={<AdminPanelSettings sx={{ fontSize: 40, color: "#D32F2F" }} />}
                                    color="#D32F2F"
                                    onClick={() => setView("ADMINS")}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <MetricCard
                                    title="Total Sellers"
                                    value={metrics?.totalSellers || 0}
                                    icon={<Store sx={{ fontSize: 40, color: "#F9B233" }} />}
                                    color="#F9B233"
                                    onClick={() => {
                                        setSellerFilter("ALL");
                                        setView("SELLERS");
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <MetricCard
                                    title="Active Sellers"
                                    value={metrics?.activeSellers || 0}
                                    icon={<VerifiedUser sx={{ fontSize: 40, color: "#2E7D32" }} />}
                                    color="#2E7D32"
                                    onClick={() => {
                                        setSellerFilter("ACTIVE");
                                        setView("SELLERS");
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <MetricCard
                                    title="Pending Sellers"
                                    value={metrics?.pendingSellers || 0}
                                    icon={<Pending sx={{ fontSize: 40, color: "#ED6C02" }} />}
                                    color="#ED6C02"
                                    onClick={() => {
                                        setSellerFilter("PENDING_VERIFICATION");
                                        setView("SELLERS");
                                    }}
                                />
                            </Grid>
                        </Grid>

                        {/* DEFAULT VIEW: ADMIN MANAGEMENT */}
                        {renderTable(admins, "ADMINS")}
                    </>
                )}

                {view === "CUSTOMERS" && renderTable(customers, "CUSTOMERS")}
                {view === "SELLERS" && renderTable(sellers, "SELLERS")}
                {view === "ADMINS" && renderTable(admins, "ADMINS")}

            </div>
        </div>
    );
};

export default SuperAdminDashboard;
