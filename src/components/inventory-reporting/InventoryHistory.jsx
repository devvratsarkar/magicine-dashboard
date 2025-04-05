import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card
} from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import moment from 'moment';

const InventoryHistory = () => {
    const demoJsonData = [
        {
            id: 1,
            itemId: {
                product_name: "one"
            },
            itemType: "Medicine",
            stockQuantity: 100,
            reason: "Initial Stock",
            createdAt: new Date()
        },
        {
            id: 2,
            itemId: {
                product_name: "one"
            },
            itemType: "Medicine",
            stockQuantity: 100,
            reason: "Adjustment",
            createdAt: new Date()
        },
        {
            id: 3,
            itemId: {
                product_name: "one"
            },
            itemType: "Medicine",
            stockQuantity: 100,
            reason: "Sale",
            createdAt: new Date()
        },
        {
            id: 4,
            itemId: {
                product_name: "one"
            },
            itemType: "Medicine",
            stockQuantity: 100,
            reason: "Sale",
            createdAt: new Date()
        },
    ];

    // State management
    const [historyData, setHistoryData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Load initial data
    useEffect(() => {
        const indexedData = demoJsonData.map((item, index) => ({ ...item, index }));
        setHistoryData(indexedData);
        setFilteredData(indexedData);
    }, []);

    // DataTable columns
    const columns = [
        {
            name: '#',
            selector: row => row.index + 1,
            sortable: true,
            width: '60px'
        },
        {
            name: 'Product Name',
            selector: row => row.itemId.product_name,
            sortable: true,
            cell: row => <div>{row.itemId.product_name}</div>
        },
        {
            name: 'Type',
            selector: row => row.itemType,
            sortable: true
        },
        {
            name: 'Quantity',
            selector: row => row.stockQuantity,
            sortable: true,
            cell: row => (
                <div className={row.stockQuantity >= 0 ? 'text-success' : 'text-danger'}>
                    {row.stockQuantity >= 0 ? '+' : ''}{row.stockQuantity}
                </div>
            )
        },
        {
            name: 'Reason',
            selector: row => row.reason,
            sortable: true
        },
        {
            name: 'Date',
            selector: row => row.createdAt,
            sortable: true,
            cell: row => moment(row.createdAt).format('DD-MM-YYYY hh:mm A')
        }
    ];

    // Search handler
    const handleSearch = (value) => {
        setSearchTerm(value);
        const filtered = historyData.filter(item => {
            return (
                item.itemId.product_name.toLowerCase().includes(value.toLowerCase()) ||
                item.itemType.toLowerCase().includes(value.toLowerCase()) ||
                item.reason.toLowerCase().includes(value.toLowerCase()) ||
                item.stockQuantity.toString().includes(value) ||
                moment(item.createdAt).format('DD-MM-YYYY hh:mm A').toLowerCase().includes(value.toLowerCase())
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    // Custom pagination component
    const CustomPagination = () => (
        <div className="d-flex justify-content-between align-items-center p-2">
            <div>
                Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
                {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
            </div>
            <div>
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="me-2"
                >
                    Previous
                </Button>
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredData.length / rowsPerPage)))}
                    disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
                >
                    Next
                </Button>
            </div>
        </div>
    );

    return (
        <Container fluid className="py-4">
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h4>Inventory History</h4>
                        </Card.Header>
                        <Card.Body>
                            {/* Search Bar */}
                            <Row className="mb-3">
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search..."
                                            value={searchTerm}
                                            onChange={(e) => handleSearch(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>Rows per page</Form.Label>
                                        <Form.Select
                                            value={rowsPerPage}
                                            onChange={(e) => {
                                                setRowsPerPage(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* DataTable */}
                            <DataTable
                                columns={columns}
                                data={filteredData}
                                pagination
                                paginationServer
                                paginationTotalRows={filteredData.length}
                                paginationDefaultPage={currentPage}
                                paginationPerPage={rowsPerPage}
                                paginationComponent={CustomPagination}
                                onChangePage={page => setCurrentPage(page)}
                                onChangeRowsPerPage={rows => {
                                    setRowsPerPage(rows);
                                    setCurrentPage(1);
                                }}
                                striped
                                highlightOnHover
                                responsive
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default InventoryHistory;