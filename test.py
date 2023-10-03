import pandas as pd
from flask import Flask, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import datetime as dt
from datetime import timedelta
from flask_cors import CORS
import geopandas as gpd
#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///LA_Crime_Data.sqlite")

# Write dataframe to SQL database
df = pd.read_csv('DataSample.csv')


df.to_sql('LA_Crime_Data', con= engine, if_exists='replace', index=False)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)
#################################################
# Flask Routes
#################################################
@app.route("/")
@app.route("/crimedata")
def locations():
    with engine.connect() as conn:
        result = conn.execute('SELECT * FROM LA_Crime_Data')

        data = [dict(row) for row in result]   

    return jsonify(data)

@app.route("/stations")
def stations():

    gdf = gpd.read_file('LAPD_Police_Stations.geojson')

    # Initialize an empty GeoJSON dictionary
    new_geojson_dict = {
        "type": "FeatureCollection",
        "features": []
    }

    # Iterate through the GeoDataFrame features
    for index, row in gdf.iterrows():
        feature = {
            "type": "Feature",
            "geometry": row.geometry.__geo_interface__,  # Convert geometry to GeoJSON format
            "properties": row.drop('geometry').to_dict()  # Convert attributes to dictionary
        }
        new_geojson_dict["features"].append(feature)

    return (new_geojson_dict)

@app.route("/cityareas")
def cityareas():

    gdf2 = gpd.read_file('Neighborhood_Service_Areas.geojson')

    # Initialize an empty GeoJSON dictionary
    new_geojson_dict2 = {
        "type": "FeatureCollection",
        "features": []
    }

    # Iterate through the GeoDataFrame features
    for index, row in gdf2.iterrows():
        feature = {
            "type": "Feature",
            "geometry": row.geometry.__geo_interface__,  # Convert geometry to GeoJSON format
            "properties": row.drop('geometry').to_dict()  # Convert attributes to dictionary
        }
        new_geojson_dict2["features"].append(feature)

    return (new_geojson_dict2)



if __name__ == '__main__':
    app.run(debug=True)

