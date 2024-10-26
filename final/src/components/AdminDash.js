import './AdminDash.css';
import React, { useEffect, useState } from 'react';

const AdminDash = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Admin Dashboard';

        const fetchUserData = async () => {
            try {
                const response = await fetch('/auth/dashboard/admin', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        window.location.href = '/auth/error2';
                        return;
                    }
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setLoading(false);

            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();

        const loadGoogleCharts = () => {
            const script = document.createElement('script');
            script.src = "https://www.gstatic.com/charts/loader.js";
            script.onload = () => {
                window.google.charts.load("current", { packages: ["corechart"] });
                window.google.charts.setOnLoadCallback(drawChart);
            };
            document.body.appendChild(script);
        };

        const drawChart = () => {
            const data = window.google.visualization.arrayToDataTable([
                ['Category', 'Quantity'],
                ['Canned Products', 11],
                ['Beverages', 2],
                ['Miscellaneous', 2],
                ['Grains', 2],
                ['Snacks', 7]
            ]);

            const options = {
                title: 'CARE Inventory',
                is3D: true,
            };

            const chart = new window.google.visualization.PieChart(document.getElementById('piechart_3d'));
            chart.draw(data, options);
        };

        loadGoogleCharts();
    }, []);

    const handleLogout = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                window.location.href = '/auth/account';
            } else {
                console.error('Logout failed:', await response.json());
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h1>Welcome!</h1>
            <p>
                This is my first full-stack web application. This is a rough draft of my Capstone project for CARE (Centro de Apoyo y Recursos para Estudiantes).
                Eventually, this web app will allow student users to sign up and register for box drops. Admin users will be able to manage their inventory and plan
                out the next drop, all while notifying student users through SMS notifications.
            </p>

            <div id="piechart_3d" style={{ width: '900px', height: '500px' }}></div>
            <div className="description">
                This pie chart will illustrate the current inventory stock.
            </div>

            <form onSubmit={handleLogout}>
                <button type="submit" className="logout-btn">Logout</button>
            </form>
        </div>
    );
};

export default AdminDash;
