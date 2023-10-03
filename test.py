import pandas as pd
from flask import Flask, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import datetime as dt
from datetime import timedelta
#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///LA_Crime_Data.sqlite")

# Write dataframe to SQL database
df = pd.read_csv('DataSample.csv')
# drop unnessesary columns
# df = df.drop(['DR_NO','Date Rptd', 'Rpt Dist No', 'Part 1-2', 
#               'Mocodes','Vict Descent', 'Premis Cd','Weapon Used Cd', 'Status',
#               'Crm Cd 2', 'Crm Cd 3', 'Crm Cd 4'], axis=1)

df.to_sql('LA_Crime_Data', con= engine, if_exists='replace', index=False)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################
@app.route("/")
@app.route("/api/v1.0/locations")
def locations():
    with engine.connect() as conn:
        result = conn.execute('SELECT * FROM LA_Crime_Data')

        data = [dict(row) for row in result]   

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
