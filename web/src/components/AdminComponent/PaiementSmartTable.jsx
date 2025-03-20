import React, { useEffect, useState } from "react";
import { CBadge, CSmartTable } from "@coreui/react-pro";
import axios from "axios";

const getBadge = (status) => {
  switch (status) {
    case "succeeded":
      return "success";
    case "pending":
      return "warning";
    case "failed":
      return "danger";
    default:
      return "secondary";
  }
};



const PaiementSmartTable = ({ setTotalAmount,setTotalCount,setFailedCount }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/payment/payments`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok) {
          throw new Error(
            `Erreur HTTP ${response.status}: ${
              (await response.json()).message || "Une erreur est survenue"
            }`
          );
        }
  
        const data = await response.json();
        setPayments(data);
  
        // Calcul du montant total des paiements réussis
        const total = data
          .filter(payment => payment.status === "succeeded")
          .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
  
        const totalCount = data.length;
  
        const failedCount = data.reduce((count, payment) => {
          if (payment.status === "failed" || payment.status === "requires_payment_method") {
            return count + 1;
          }
          return count;
        }, 0);
  
        // Mise à jour des états
        setFailedCount(failedCount);
        setTotalAmount(total);
        setTotalCount(totalCount);
      } catch (error) {
        console.error("Erreur lors de la récupération des paiements :", error);
      }
      setLoading(false);
    };
  
    fetchPayments();
  }, [setTotalAmount]);
  

  const columns = [
    { key: "id", label: "ID Paiement" },
    { key: "amount", label: "Montant (Fr CFA)" },
    { key: "status", label: "Statut" },
    { key: "payment_method", label: "Méthode de paiement" },
    { key: "created", label: "Date de paiement" },
  ];

  return (
    <CSmartTable
      columns={columns}
      items={payments}
      loading={loading}
      pagination
      columnFilter
      columnSorter
      cleaner
      clickableRows
      itemsPerPage={5}
      scopedColumns={{
        id: (item) => {
          const id = item.id;
          const truncatedId = id.length > 10 ? `${id.substring(0, 4)}...${id.slice(-4)}` : id;
          return <td>{truncatedId}</td>;
        },
        status: (item) => (
          <td>
            <CBadge color={getBadge(item.status)}>
              {item.status === "requires_payment_method" ? "Incomplet" : item.status}
            </CBadge>
          </td>
        ),
        created: (item) => (
          <td>{new Date(item.created).toLocaleString("fr-FR")}</td>
        ),
      }}
      noItemsLabel="Aucun paiement disponible"
      tableFilter
      tableProps={{
        responsive: true,
        striped: true,
        hover: true,
      }}
    />
  );
};

export default PaiementSmartTable;
