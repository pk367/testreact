import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CsvDataDisplay = () => {
    const [csvData, setCsvData] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [userTickers, setUserTickers] = useState('');
    const [maxBaseCandles, setMaxBaseCandles] = useState(3);
    const [zoneDistance, setZoneDistance] = useState(10);
    const [headers, setHeaders] = useState([]);

    const fileId = '1--h5HkNaJuc3TOUNXJMBqFQkqI6MgaN9';
    const csvUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    useEffect(() => {
        const fetchCsvData = async () => {
            try {
                const response = await axios.get(csvUrl);
                const data = response.data;
                const rows = data.split('\n').map(row => row.split(','));
                setHeaders(rows[0]);
                setCsvData(rows.slice(1));
            } catch (error) {
                console.error('Error fetching CSV data:', error);
            }
        };

        fetchCsvData();
    }, [csvUrl]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const filtered = csvData.filter(row => {
            const tickerMatch = userTickers.split(',').map(ticker => ticker.trim()).includes(row[0]);
            const maxBaseCandlesMatch = parseInt(row[12]) <= maxBaseCandles;
            const zoneDistanceMatch = Math.abs(parseFloat(row[10])) <= zoneDistance;

            return tickerMatch && maxBaseCandlesMatch && zoneDistanceMatch;
        });

        setFilteredRows(filtered);
    };

    return (
        <div className="container">
            <h3 className="header">😊 Welcome to Demand-Supply Daily Zone Scan Engine</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="user_tickers">Enter valid symbols (comma-separated):</label>
                    <input
                        type="text"
                        className="form-control"
                        value={userTickers}
                        onChange={(e) => setUserTickers(e.target.value)}
                        placeholder="SBIN, TCS, ITC"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="max_base_candles">Select max_base_candles</label>
                    <input
                        type="number"
                        className="form-control"
                        value={maxBaseCandles}
                        onChange={(e) => setMaxBaseCandles(e.target.value)}
                        min="1"
                        max="6"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="zone_distance">Current price to zone entry price distance in %</label>
                    <input
                        type="number"
                        className="form-control"
                        value={zoneDistance}
                        onChange={(e) => setZoneDistance(e.target.value)}
                        min="1"
                    />
                </div>

                <button type="submit" className="btn btn-primary">🔍 Scan Now</button>
            </form>

            {filteredRows.length > 0 && (
                <table className="table table-striped mt-4">
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CsvDataDisplay;
