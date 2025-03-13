import React, { useEffect, useState } from "react";
import { CSmartTable, CButton, CCollapse, CModal, CModalBody, CModalFooter, CModalHeader } from "@coreui/react-pro";
import axios from "axios";
import { CFormSwitch } from "@coreui/react-pro";
import { CPagination, CPaginationItem } from "@coreui/react";

const getBadge = (status) => {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "warning";
    case "banned":
      return "danger";
    default:
      return "secondary";
  }
};

function ClientSmartTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 5;
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers(page);
  }, []);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Récupérer le token depuis le stockage local
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/clients?page=${page}&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token dans l'en-tête
        },
      });
      
      console.log("Utilisateurs récupérés :", data);
      setUsers(data.clients || []);
      setPages(data.totalPages || 1);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
    setLoading(false);
  };
  


  //pagination
 const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= pages) {
    setPage(newPage);
  }
};
  

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
      setShowModal(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
    }
  };

  const toggleAdminRole = async (user) => {
    try {
      const updatedUser = { ...user, isAdmin: !user.isAdmin };

      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/role/${user._id}`, {
        isAdmin: updatedUser.isAdmin,
      });

      setUsers(users.map((u) => (u._id === user._id ? updatedUser : u)));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle :", error);
    }
  };

  const toggleDetails = (id) => {
    setDetails((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };



  const columns = [
    { key: "firstName", label: "Prénom" },
    { key: "lastName", label: "Nom" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Téléphone" },
    // {
    //   key: "isAdmin",
    //   label: "Admin",
    //   _style: { width: "10%" },
    // },
    { key: "show_details", label: "", filter: false, sorter: false },
  ];

  return (
    <>
      <CSmartTable
        columns={columns}
        items={users}
        loading={loading}
        pagination
        columnFilter
        columnSorter
        cleaner
        clickableRows
        itemsPerPage={5}
        onPageChange={(page) => setPage(page)}
        scopedColumns={{

          isAdmin: (item) => (
            <td>
              <CFormSwitch
                checked={item.isAdmin}
                onChange={() => toggleAdminRole(item)}
                label=""
              />

            </td>
          ),
        show_details: (item) => (
            <td className="py-2">
            <CButton
            color="primary"
            variant="outline"
            size="sm"
            onClick={() => toggleDetails(item._id)}
             >
            {details.includes(item._id) ? "Cacher" : "Voir action"}
             </CButton>
             </td>
        ),
          details: (item) => (
            <CCollapse visible={details.includes(item._id)}>
            <div className="p-2">
              {item.createdAt}
            <CButton size="sm" color="info" style={{ fontSize: "0.75rem" }} >
                Modifier
            </CButton>
            <CButton
                size="sm"
                color="danger"
                className="ms-1"
                style={{ fontSize: "0.75rem" }}
                onClick={() => {
                setUserToDelete(item._id);
                setShowModal(true);
                }}
                >
                  Supprimer
                </CButton>
            </div>
            </CCollapse>
          ),
        }}
        noItemsLabel="Aucun client présent"
        selectable
        tableFilter
        tableProps={{
        className: 'add-this-custom-class',
        responsive: true,
        striped: true,
        hover: true,
        }}
        tableBodyProps={{
          className: 'align-middle',
        }}
      />

      {/* Modal de confirmation */}
      <CModal visible={showModal} onClose={() => setShowModal(false)} alignment="center">
        <CModalHeader>Confirmation de suppression</CModalHeader>
        <CModalBody>
          Êtes-vous sûr de vouloir supprimer cet utilisateur ?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>Annuler</CButton>
          <CButton color="danger" onClick={() => deleteUser(userToDelete)}>Supprimer</CButton>
        </CModalFooter>
      </CModal>

        {/* Pagination personnalisée avec CoreUI */}
          <div className="d-flex justify-content-center my-3">
            <CPagination aria-label="Page navigation example">
              <CPaginationItem
                aria-label="Previous"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
      
              {[...Array(pages)].map((_, index) => (
                <CPaginationItem
                  key={index + 1}
                  active={page === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </CPaginationItem>
              ))}
      
              <CPaginationItem
                aria-label="Next"
                disabled={page === pages}
                onClick={() => handlePageChange(page + 1)}
              >
                <span aria-hidden="true">&raquo;</span>
              </CPaginationItem>
            </CPagination>
          </div>
    </>
  );
}

export default ClientSmartTable;
