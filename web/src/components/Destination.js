const destinations = [
    { id: 1, name: "Abidjan" },
    { id: 2, name: "Bouaké" },
    { id: 3, name: "Korhogo" },
    { id: 4, name: "Yamoussoukro" }
  ];
  
  function Destination() {
    return (
      <div>
        <div className="container-fluid team py-5">
          <div className="container py-5">
            <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '800px' }}>
              <h1 className="display-5 text-capitalize mb-3">Nos<span className="text-primary"> Destinations</span> principales</h1>
              <p className="mb-0">
                  Découvrez les destinations les plus prisées avec  <strong>RafRaf</strong>, parfaites pour vos prochaines vacances ou voyages d'affaires. 
                  Que vous recherchiez des plages paradisiaques, des villes dynamiques ou des paysages naturels à couper le souffle, 
                  nous avons la destination idéale pour vous. Réservez dès maintenant et laissez-vous guider vers votre prochaine aventure !
              </p>
            </div>
            <div className="row g-4">
              {destinations.map((destination, index) => (
                <div key={destination.id} className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay={`${0.1 + index * 0.2}s`}>
                  <div className="team-item p-3 pt-0 d-flex flex-column h-100" style={{ height: '350px' }}>
                    <div className="team-img">
                      <img 
                        src={`img/ville-${destination.id}.jpg`} 
                        className="img-fluid rounded w-100" 
                        alt={destination.name} 
                        style={{ height: '150px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="team-content pt-3 d-flex flex-column flex-grow-1">
                      <h4 className="text-center">{destination.name}</h4>
                      <p className="text-center flex-grow-1">Découvrez {destination.name}, une destination incontournable en Côte d'Ivoire.</p>
                      <button className="btn btn-primary mt-auto">Réserver</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Destination;
