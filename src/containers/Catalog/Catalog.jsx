import React from "react";
import CatalogCards from "./CatalogCards/CatalogCards.jsx";
import DocumentTitle from "../../components/helmet/document_title.jsx";

function Catalog() {
    DocumentTitle("Catalog");

    return (
        <div>
            <CatalogCards/>
        </div>
    );
}

export default Catalog;