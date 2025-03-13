import React from "react";
import { CTable, CButton } from "@coreui/react";
import Typography from '@mui/material/Typography';

function VilleTable({ villes, onEdit, onDelete }) {
  const columns = [
    { key: "id", label: "#" },
    { key: "nom", label: "Nom de la Ville" },
    { key: "actions", label: "Actions" },
  ];

  const items = villes.map((ville, index) => ({
    id: index + 1,
    nom: ville.nom,
    actions: (
      <>
        <CButton color="warning" size="sm" className="me-2" onClick={() => onEdit(ville)}>
          Modifier
        </CButton>
        <CButton color="danger" size="sm" onClick={() => onDelete(ville._id)}>
          Supprimer
        </CButton>
      </>
    ),
  }));

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      <div style={{ width: "60%" }}>
      {/* <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
        Liste des Villes disponibles
      </Typography> */}
      {/* <hr style={{ width: '80%',alignItems:'center', borderColor: 'grey' }} /> */}
        <CTable columns={columns} items={items} />
      </div>
    </div>
  );
}

export default VilleTable;
