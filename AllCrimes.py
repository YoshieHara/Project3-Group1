# Import required Libraries

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify

# Create Engine for database
engine = create_engine("sqlite:///crime.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the tables
CleanedData = Base.classes.cleaned_data
Drugs = Base.classes.drugs


# Flask Setup
app = Flask(__name__)


# Flask Routes
@app.route("/")
def CrimesInVictoria():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/CrimesInVictoria<br/>"
        f"/api/v1.0/DrugsOffencesVictoria"
    )


# Route: "/api/v1.0/CrimesInVictoria"
 
@app.route("/api/v1.0/CrimesInVictoria")
def AllData():
    # Create session (link) from Python to the database
    session = Session(bind=engine)

    """Return a list of crimes data"""
    # Query all crimes
    results = session.query(CleanedData.Year, CleanedData.OffenceDivision, CleanedData.OffenceSubdivision, CleanedData.OffenceSubgroup, CleanedData.OffenceCount).all()

    session.close()

    # dictionary from the row data and append to the list "all_crimes"
    all_crimes = []
    for Year, OffenceDivision, OffenceSubdivision, OffenceSubgroup, OffenceCount in results:
        crime_dict = {}
        crime_dict["Year"] = Year
        crime_dict["OffenceDivision"] = OffenceDivision
        crime_dict["OffenceSubdivision"] = OffenceSubdivision
        crime_dict["OffenceSubgroup"] = OffenceSubgroup
        crime_dict["OffenceCount"] = OffenceCount
        
        all_crimes.append(crime_dict)
    responce = jsonify(all_crimes)
    responce.headers.add('access-control-allow-origin', '*')
    return responce


# Route: "/api/v1.0/DrugsOffencesVictoria"

@app.route("/api/v1.0/DrugsOffencesVictoria")
def AllDrugs():
    # Create session (link) from Python to the database
    session = Session(bind=engine)

    """Return a list of crimes data"""
    # Query all drugs crimes
    results = session.query(Drugs.Year, Drugs.OffenceSubdivision, Drugs.OffenceGroup, Drugs.OffenceDescription, Drugs.CSADrugType, Drugs.OffenceCount).all()

    session.close()

    # dictionary from the row data and append to the list "all_drugs"
    all_drugs = []
    for Year, OffenceSubdivision, OffenceGroup, OffenceDescription, CSADrugType, OffenceCount in results:
        drugs_dict = {}
        drugs_dict["Year"] = Year
        drugs_dict["OffenceSubdivision"] = OffenceSubdivision
        drugs_dict["OffenceGroup"] = OffenceGroup
        drugs_dict["OffenceDescription"] = OffenceDescription
        drugs_dict["CSADrugType"] = CSADrugType
        drugs_dict["OffenceCount"] = OffenceCount
        
        all_drugs.append(drugs_dict)
    responce = jsonify(all_drugs)
    responce.headers.add('access-control-allow-origin', '*')
    return responce


if __name__ == '__main__':
    app.run(debug=True)
