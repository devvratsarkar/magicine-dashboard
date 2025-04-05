import React from 'react'
import { Row, Card, Col } from "react-bootstrap";
import { InventoryWithoutVariantDataTable } from '../../commondata/inventoryWithoutVariantdata';
export default function InventoryWithoutVariant() {
    return (

            <div className="table-responsive p-0">
                <InventoryWithoutVariantDataTable />
            </div>
    )
}
