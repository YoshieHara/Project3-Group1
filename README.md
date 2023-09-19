# **Project 3**
# **Title: Victoria Safety Analysis**

## **Group 1: Hussam Goda, Kashif Bashir, Nairui Guo and Yoshie Hara**


### **Introduction and Objective**
Safety is an important aspect in any Country/Location. As people's behaviours, beliefs, and life standards are different, a crime-free location is almost impossible to find. With that said, however, safety (crimes) data analysis may act as useful resources for governments, law enforcement and police forces to determine changes/updates in their plans to tackle crimes and improve safety. For instance, such analysis would determine two important outcomes; the occurrence of each crime category relative to others, and how each category has changed over time.
This project uses information reported by the Crime Statistics Agency in relation to offences/crimes recorded in Victoria. Data are collected in the form of Excel files. Two Excel files are used in this study; the first file (crimes.xlsx) reports all types of crimes, while the second file (Drugs.xlsx) takes a deeper look into the crimes related to drugs. The data are reported over a few years ending March 2023.

Data Sources Data used in this project is available through the following website: https://www.crimestatistics.vic.gov.au/crime-statistics/latest-victorian-crime-data/download-data 

The objective of this project is to use available data to investigate the following. 
1. The relative occurrence of different crime categories in Victoria according to Offence Division (per year)
2. Year-to-year changes in offence counts for each Offence Division
3. The relative occurrence of drug crimes according to Drug Offence Groups, and
4. Year-to-year change in offence counts for each Drug Offence Group (per year).

As per the project requirements, this project uses the second track: "A dashboard with multiple charts that update from the same data".


### **Project Files**
The following list declares all files used to address the objectives given above.

1. crimes.xlsx: This is an Excel file reporting crimes in Victoria from 2014 to 2023. 
2. Drugs.xlsx: This is an Excel file reporting drugs-related crimes from 2014 to 2023
3. DataCleaningAndConversion.ipynb: A jupyter notebook used to prepare data 
4. crimes.csv: CSV file for crimes (output from DataCleaningAndConversion.ipynb) 
5. drugs.csv: CSV file for drugs-related crimes (output from DataCleaningAndConversion.ipynb) 
6. crime.sqlite: An Sqlite database to host both CSV files indicated above
7. AllCrimes.py: A Python code to connect to crime.sqlite and generate Flask-API for inclusion in the java script to generate the dashboard 
8. index.html: An HTML file to activate and run demo.js
9. style.css: A CSS file to style the dashboard
10. demo.js: A java script file contains all codes to construct the dashboard (four plots in total)
