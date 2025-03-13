import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const paymentMethods = [
  { id: 1, description: "Payez en espèces", image: "img/cash.jpg" },
  { id: 2, description: "Payez par OM.", image: "img/orange.jpg" },
  { id: 3, description: "Payer par Wave", image: "img/wave.webp" },
  { id: 4, description: "Payez par Moov.", image: "img/moov.png" },
  { id: 5, description: "Payez par Stripe", image: "img/stripe.gif" },
];

function MethodePaiement({ onSelectMethod }) {
  const [selectedMethod, setSelectedMethod] = React.useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Vérifier si l'utilisateur est admin
  const isAdmin = !!user?.isAdmin;

  // Filtrer les méthodes de paiement en fonction du rôle
  const filteredMethods = isAdmin
    ? paymentMethods.filter((method) => method.id === 1) // Afficher seulement "Espèces"
    : paymentMethods.filter((method) => method.id !== 1); // Sinon, exclure "Espèces"

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", padding: 2, textAlign: "center", position: "relative" }}>
      <Typography
        variant="h6"
        sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: 2 }}
      >
        Sélectionnez votre méthode de paiement
      </Typography>

      <Box
        sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 2, flexWrap: "nowrap", overflowX: "auto", paddingX: 1 }}
      >
        {filteredMethods.map((method, index) => (
          <Card
            key={method.id}
            sx={{ width: 150, height: 100, boxShadow: 2, display: "flex", flexDirection: "column", justifyContent: "space-between", marginBottom: "12%" }}
          >
            <CardActionArea
              onClick={() => {
                console.log("Méthode sélectionnée :", index);
                setSelectedMethod(index);
                if (method.id === 5) {
                  navigate("/Stripe");
                }
                if (method.id === 1) {
                  navigate("/Espece");
                }
                if (onSelectMethod) {
                  onSelectMethod(index);
                }
              }}
              data-active={selectedMethod === index ? "" : undefined}
              sx={{
                height: "100%",
                backgroundColor: selectedMethod === method.id ? "action.selected" : "inherit",
                "&:hover": { backgroundColor: "action.selectedHover" },
              }}              
            >
              <CardMedia component="img" image={method.image} alt={method.description} sx={{ height: 50, objectFit: "contain", margin: "auto" }} />
              <CardContent sx={{ textAlign: "center", flexGrow: 1, padding: "8px" }}>
                <Typography variant="caption" color="text.secondary">
                  {method.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", fontSize: "0.8rem", padding: "3px 8px", backgroundColor: "orange", "&:hover": { backgroundColor: "#ff9800" } }}
      >
        Retour
      </Button>
    </Card>
  );
}

export default MethodePaiement;
