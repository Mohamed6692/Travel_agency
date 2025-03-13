import React from "react";
import teams from "../data/team.json";
import TeamSingle from "./TeamSingle";

export default function TeamGrid() {
  return (
    <section className="py-8">
      <h2 class="display-5 fw-bold mb-4 text-center">Our team</h2>
      <div className="row g-6">
        {teams.entries.map((team, index) => (
          <TeamSingle
            key={index}
            img={team.img}
            name={team.name}
            title={team.title}
            bio={team.bio}
          />
        ))}
      </div>
    </section>
  );
}
